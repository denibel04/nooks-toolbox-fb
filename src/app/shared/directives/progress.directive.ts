import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appProgress]'
})
export class ProgressDirective {
  
  private min_width =15
/**
   * Sets the width of the element based on the provided progress value.
   * Ensures the width is at least `min_width`.
   * @param value The progress value used to set the width.
   */
  @Input('appProgress') set progress(value: number) {
    const width= Math.max(value, this.min_width);
    this.renderer.setStyle(
      this.el.nativeElement,
      'width',
      `${width}%` 
    );
  }
 /**
   * Constructor to inject dependencies.
   * @param renderer Renderer to manipulate the host element.
   * @param el Reference to the host element.
   */
  constructor(
    private renderer:Renderer2,
    private el:ElementRef
  ) {}

}
