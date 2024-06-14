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

  villagers:Villager[] = [];


  propagateChange = (obj: any) => { }

  constructor(
    public villagerService: VillagerService,
    public islandService: IslandService,
    public authService: AuthStrapiService
  ) { }

   /**
   * Initialize the component and load villagers.
   */
  async ngOnInit() {
    this.villagers = await this.villagerService.getFiltered("a");
  }

/**
   * Load villagers with an empty filter.
   */
  async onLoadVillagers() {
    this.loadVillagers("");
    
  }
/**
   * Load villagers based on a filter.
   * @param filter The filter string.
   */
  private async loadVillagers(filter: string) {
    this.villagers = await this.villagerService.getFiltered(filter);
    
  }
/**
   * Select a villager by name and propagate the change if specified.
   * @param name The name of the villager.
   * @param propagate Whether to propagate the change.
   */
  private async selectVillager(name: string | undefined, propagate: boolean = false) {
    if(propagate){
      if (!name){
        this.villagerSelected = undefined;
        this.propagateChange(undefined);
      }
      else{
        this.villagerSelected = this.villagers.find(v=>v.attributes.name===name);
        this.propagateChange(this.villagerSelected!.attributes.name);
      }
    }
    
  }
/**
   * Write the value to the component.
   * @param obj The value to write.
   */
  writeValue(obj: any): void { 
    this.villagerSelected = obj;
  }
 /**
   * Register the change function.
   * @param fn The change function.
   */
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * Register the touched function.
   * @param fn The touched function.
   */
  registerOnTouched(fn: any): void {

  }
/**
   * Set the disabled state of the component.
   * @param isDisabled Whether the component is disabled.
   */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Filter villagers based on a filtering string.
   * @param filtering The filtering string.
   */
  private async filter(filtering:string){
    this.loadVillagers(filtering);
  }

/**
   * Handle the filter event.
   * @param evt The event object.
   */
  onFilter(evt:any){
    this.filter(evt.detail.value);
    evt.stopPropagation();
    evt.preventDefault();
  }

   /**
   * Handle the villager click event.
   * @param popover The popover component.
   * @param villager The clicked villager.
   */
  onVillagerClicked(popover:IonPopover, villager:Villager){
    this.selectVillager(villager.attributes.name, true);
    popover.dismiss();
  }

  /**
   * Clear the search input and reset the filter.
   * @param input The input component.
   */
  clearSearch(input:IonInput){
    input.value = "";
    this.filter("");
  }

    /**
   * Deselect the villager and optionally dismiss the popover.
   * @param popover The popover component.
   */
  deselect(popover:IonPopover|null=null){
    this.selectVillager(undefined, true);
    if(popover)
      popover.dismiss();
  }

}
