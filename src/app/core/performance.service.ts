import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PerformanceService {
  private frameId: number | null = null;
  private readonly isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Log layout shifts
      if (entry.entryType === 'layout-shift') {
        console.warn('Layout shift detected:', entry);
      }
    }
  });

  // Signal for components to know if they should use reduced animations
  readonly shouldReduceMotion$ = new BehaviorSubject<boolean>(this.isReducedMotion);

  constructor() {
    // Observe layout shifts and long tasks
    this.perfObserver.observe({ entryTypes: ['layout-shift', 'longtask'] });
  }

  /**
   * Schedule DOM operations to run in the next frame
   */
  scheduleFrame(callback: () => void): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    this.frameId = requestAnimationFrame(() => {
      callback();
      this.frameId = null;
    });
  }

  /**
   * Batch multiple reads or writes to prevent layout thrashing
   */
  batchOperations(reads: (() => void)[] = [], writes: (() => void)[] = []): void {
    this.scheduleFrame(() => {
      // Do all reads first
      reads.forEach(read => read());
      // Then do all writes
      writes.forEach(write => write());
    });
  }

  /**
   * Clean up performance observers
   */
  destroy(): void {
    this.perfObserver.disconnect();
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }
}