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

  villagerSelected: Villager | undefined;
  disabled: boolean = true;
  villagers: Villager[] = [];
  private island: Island | null = null;

  @Input() num: number =0;


  propagateChange = (obj: any) => { }

  constructor(
    public villagerService: VillagerService,
    public islandService: IslandService,
    public authService: AuthStrapiService
  ) { }

  async ngOnInit() {
    const user = await lastValueFrom(this.authService.me());
    console.log(user)
    this.island = await lastValueFrom(this.islandService.getIsland(user.island.data.id));
    console.log(this.island?.attributes.villagers)
    if (this.island?.attributes?.villagers && this.island.attributes.villagers[this.num] != null) {
      this.selectVillager(this.island.attributes.villagers[this.num].id)
    }
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

  private async selectVillager(id: number | undefined, propagate: boolean = false) {
    if (id) {
      this.villagerSelected = await lastValueFrom(this.villagerService.getVillager(Number(id)));
    }
    else
      this.villagerSelected = undefined;
    if (propagate && this.villagerSelected)
      this.propagateChange(this.villagerSelected.id);
  }

  writeValue(obj: any): void {
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
