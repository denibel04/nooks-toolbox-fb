import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonInput, IonPopover } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { Island } from 'src/app/core/interfaces/island';
import { Villager } from 'src/app/core/interfaces/villager';
import { AuthStrapiService } from 'src/app/core/services/api/strapi/auth-strapi.service';
import { IslandService } from 'src/app/core/services/island.service';
import { VillagerService } from 'src/app/core/services/villager.service';


export const VILLAGER_SELECTABLE_VALUE_ACCESOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => VillagerSelectableComponent),
  multi: true
};

@Component({
  selector: 'app-villager-selectable',
  templateUrl: './villager-selectable.component.html',
  styleUrls: ['./villager-selectable.component.scss'],
  providers: [VILLAGER_SELECTABLE_VALUE_ACCESOR]
})
export class VillagerSelectableComponent implements OnInit, ControlValueAccessor {

  villagerSelected: Villager | undefined = undefined;
  disabled: boolean = true;
  private island: Island | null = null;

  @Input() num: number =0;

  @Input('villagers') villagers:Villager[] = [];


  propagateChange = (obj: any) => { }

  constructor(
    public villagerService: VillagerService,
    public islandService: IslandService,
    public authService: AuthStrapiService
  ) { }

  async ngOnInit() {
  }


  async onLoadVillagers() {
    this.loadVillagers("");
    
  }

  private async loadVillagers(filter: string) {
    
    console.log("filter", filter)
    const villagers = await lastValueFrom(this.villagerService.getFiltered(filter));
    console.log("paginated villagers",this.num, villagers);
    this.villagers = villagers;
    
  }

  private async selectVillager(id: string | undefined, propagate: boolean = false) {
    if(propagate){
      if (!id){
        this.villagerSelected = undefined;
        this.propagateChange(undefined);
      }
      else{
        this.villagerSelected = this.villagers.find(v=>v.id===id);
        this.propagateChange(this.villagerSelected!.id);
      }
    }
    
  }

  writeValue(obj: any): void { 
    this.villagerSelected = obj;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  
  private async filter(filtering:string){
    this.loadVillagers(filtering);
  }

  onFilter(evt:any){
    this.filter(evt.detail.value);
    evt.stopPropagation();
    evt.preventDefault();
  }

  onVillagerClicked(popover:IonPopover, villager:Villager){
    this.selectVillager(villager.id, true);
    popover.dismiss();
  }

  clearSearch(input:IonInput){
    input.value = "";
    this.filter("");
  }

  deselect(popover:IonPopover|null=null){
    this.selectVillager(undefined, true);
    if(popover)
      popover.dismiss();
  }

}
