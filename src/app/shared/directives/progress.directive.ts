import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appProgress]'
})
export class ProgressDirective {
  
  private min_width =20

  @Input('appProgress') set progress(value: number) {
    const width= Math.max(value, this.min_width);
    this.renderer.setStyle(
      this.el.nativeElement,
      'width',
      `${width}%` 
    );
  }

  constructor(
    private renderer:Renderer2,
    private el:ElementRef
  ) {}

}
