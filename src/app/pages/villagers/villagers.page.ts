import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/data';
import { Villager } from 'src/app/core/interfaces/villager';
import { VillagerService } from 'src/app/core/services/villager.service';

@Component({
  selector: 'app-villagers',
  templateUrl: './villagers.page.html',
  styleUrls: ['./villagers.page.scss'],
})
export class VillagersPage implements OnInit {

  
  private _villagers = new BehaviorSubject<Villager[]>([]);
  public villagers$ = this._villagers.asObservable();

  //public _pagination = new BehaviorSubject<Pagination>({page:0, pageSize:0, pageCount:0, total:0});
  //private pagination$ = this._pagination.asObservable();


  constructor(
    public villagerService:VillagerService,
    public modal:ModalController
  ) { }

  ngOnInit():void {
  }

  /*
  private loadVillagers(page:number=1, refresher:any=null) {
    this.villagerService.queryPaginated(page).subscribe({
      next:response=>{
        this._villagers.next([...this._villagers.value, ...response.data]);
        this._pagination.next(response.pagination);
        console.log(this._pagination)
        
        if(refresher)refresher.complete();
      },
      error:err=>{
        console.log(err);
      }
    })
  }

*/
doInfinite(event: any) {
  this.villagerService.getPaginatedVillagers().subscribe(() => {
    event.target.complete(); // Marcar el evento como completo para que esté listo para más datos
  });
}
}
