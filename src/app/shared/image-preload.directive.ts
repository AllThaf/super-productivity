import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'img[preload]',
  standalone: true
})
export class imagePreloadDirective {
  @HostBinding('style.display') display = 'none';
  
  @HostListener('load')
  onLoad() {
    this.display = 'block';
  }
  
  @HostListener('error')
  onError() {
    this.display = 'none';
  }
}