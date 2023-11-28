import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Pagination } from 'src/app/core/interfaces/data';
import { Villager } from 'src/app/core/interfaces/villager';
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
  pagination: Pagination = { page: 0, pageSize: 0, pageCount: 0, total: 0 }

  propagateChange = (obj: any) => { }

  constructor(
    public villagerService: VillagerService
  ) { }

  async onLoadVillagers() {
    this.loadVillagers("");
  }


  private async loadVillagers(filter: string) {
    const paginated_villagers = await lastValueFrom(this.villagerService.query(filter));
    this.pagination = paginated_villagers.pagination;
    this.villagers = paginated_villagers.data;
  }

  private async selectVillager(id: number | undefined, propagate: boolean = false) {
    if (id) {
      this.villagerSelected = await lastValueFrom(this.villagerService.getVillager(id));
    }
    else
      this.villagerSelected = undefined;
    if (propagate && this.villagerSelected)
      this.propagateChange(this.villagerSelected.id);
  }

  writeValue(obj: any): void {
    this.selectVillager(obj);

  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() { }

}
