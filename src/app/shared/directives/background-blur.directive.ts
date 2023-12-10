import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBackgroundBlur]'
})
export class BackgroundBlurDirective {

  @Input() set appBackgroundBlur(condition: boolean) {
    if (condition) {
      this.renderer.addClass(this.el.nativeElement, 'blur-background');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'blur-background');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

}
