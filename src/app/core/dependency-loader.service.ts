import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DependencyLoaderService {
  private loadedModules: { [key: string]: Promise<any> } = {};

  async loadModule(moduleName: string): Promise<any> {
    if (!this.loadedModules[moduleName]) {
      this.loadedModules[moduleName] = this._importModule(moduleName);
    }
    return this.loadedModules[moduleName];
  }

  private async _importModule(moduleName: string): Promise<any> {
    switch (moduleName) {
      case 'chart':
        return import('chart.js').then(m => m.Chart);
      case 'markdown':
        return import('marked').then(m => m.marked);
      case 'shepherd':
        return import('shepherd.js').then(m => m.default);
      default:
        throw new Error(`Unknown module: ${moduleName}`);
    }
  }
}