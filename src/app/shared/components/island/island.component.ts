import { Component, Input, OnInit } from '@angular/core';
import { Island } from 'src/app/core/interfaces/island';

@Component({
  selector: 'app-island',
  templateUrl: './island.component.html',
  styleUrls: ['./island.component.scss'],
})
export class IslandComponent  implements OnInit {

  @Input() island:Island | null=null;

  constructor() { 

  }

  ngOnInit() {
    console.log(this.island)
  }
  

}
