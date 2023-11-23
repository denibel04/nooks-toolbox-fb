import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Island } from 'src/app/core/interfaces/island';

@Component({
  selector: 'app-island',
  templateUrl: './island.component.html',
  styleUrls: ['./island.component.scss'],
})
export class IslandComponent  implements OnInit {

  @Input() island:Island | null=null;

  @Output() onEditClicked:EventEmitter<void> = new EventEmitter<void>();

  constructor() { 

  }

  ngOnInit() {
    console.log(this.island)
  }

  onEditClick(event:any) {
    //event.preventDefault();
    event.stopPropagation();
    this.onEditClicked.emit();
    
    console.log("Clic en el botón de edición");
  }
  

}
