import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBackgroundBlur]'
})
export class BackgroundBlurDirective {
 /**
   * Condition to apply or remove the blur class.
   */
  @Input() set appBackgroundBlur(condition: boolean) {
    if (condition) {
      this.renderer.addClass(this.el.nativeElement, 'blur-background');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'blur-background');
    }
  }
/**
   * Constructor to inject dependencies.
   * @param el Reference to the host element.
   * @param renderer Renderer to manipulate the host element.
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {}

}
