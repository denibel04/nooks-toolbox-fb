import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appProgress]'
})
export class ProgressDirective {
  

  @Input('appProgress') set progress(value: number) {
    console.log("directive", typeof value)
    this.renderer.setStyle(
      this.el.nativeElement,
      'width',
      `${value}%` 
    );
  }

  constructor(
    private renderer:Renderer2,
    private el:ElementRef
  ) {}

}
