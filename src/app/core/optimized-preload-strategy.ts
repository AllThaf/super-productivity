import { Injectable } from '@angular/core';
import { PreloadAllModules, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OptimizedPreloadStrategy extends PreloadAllModules {
  override preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Always load the initial route immediately
    if (route.path === '') {
      return load();
    }

    // Don't preload if explicitly disabled
    if (route.data?.['noPreload']) {
      return of(null);
    }

    // For critical routes (tasks, main views), load immediately
    if (route.path?.includes('tasks') || route.path?.includes('TODAY')) {
      return load();
    }

    // Determine priority - default to low priority (0)
    const priority = route.data?.['preloadPriority'] || 0;
    
    // For low priority routes, delay loading slightly
    if (priority === 0) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.next(load());
          observer.complete();
        }, 2000); // 2 second delay for non-critical routes
      });
    }

    // Load other routes normally
    return load();
  }
}