import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class DOMHelper {
  private readQueue: (() => void)[] = [];
  private writeQueue: (() => void)[] = [];
  private rafId: number | null = null;

  scheduleRead(fn: () => void): void {
    this.readQueue.push(fn);
    this.scheduleUpdate();
  }

  scheduleWrite(fn: () => void): void {
    this.writeQueue.push(fn);
    this.scheduleUpdate();
  }

  private scheduleUpdate(): void {
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => this.update());
    }
  }

  private update(): void {
    // Process all read operations first
    const reads = this.readQueue;
    this.readQueue = [];
    reads.forEach(read => read());

    // Then process all write operations
    const writes = this.writeQueue;
    this.writeQueue = [];
    writes.forEach(write => write());

    this.rafId = null;

    // Schedule the next update if there are still operations queued
    if (this.readQueue.length || this.writeQueue.length) {
      this.scheduleUpdate();
    }
  }

  // Helper method to get element dimensions without causing layout thrashing
  getDimensions(element: HTMLElement): DOMRect {
    return element.getBoundingClientRect();
  }

  // Helper method to batch style updates
  batchStyleUpdates(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    this.scheduleWrite(() => {
      Object.assign(element.style, styles);
    });
  }
}