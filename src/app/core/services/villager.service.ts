import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedVillagers, Villager } from '../interfaces/villager';
import { DataService } from './api/strapi/data.service';
import { ApiService } from './api/api.service';
import { FirebaseService } from './firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class VillagerService {

  constructor(
    private dataService: DataService,
    private fbSvc: FirebaseService,
    private api: ApiService
  ) {
    this.getPaginatedVillagers().subscribe()
  }

  private _villagersPaginated: BehaviorSubject<PaginatedVillagers> = new BehaviorSubject<PaginatedVillagers>({ data: [], pagination: { page: 0, pageCount: 0, pageSize: 0, total: 0 } });
  public villagersPaginated$: Observable<PaginatedVillagers> = this._villagersPaginated.asObservable();

  private _villagers: BehaviorSubject<Villager[]> = new BehaviorSubject<Villager[]>([])
  public villagers$: Observable<Villager[]> = this._villagers.asObservable();

  lastVillager: any = null;   
  
  public getPaginatedVillagers(): Observable<Villager[]> {
    console.log("getpag", this._villagers.value.length);
    return new Observable(observer => {
      this.fbSvc.getDocumentsPaginated("villagers", 25, "name", this.lastVillager).then(villagersPaginated => {
        console.log("paginated villagers", villagersPaginated);
        const newVillagers = villagersPaginated.map(doc => {
          const data = doc.data;
          const villager: Villager = {
            id: doc['id'],
            attributes: {
              name: data['name'],
              image_url: data['image_url'],
              species: data['species'],
              personality: data['personality'],
              gender: data['gender'],
              birthday_month: data['birthday_month'],
              birthday_day: parseInt(data['birthday_day']),
              sign: data['sign'],
              quote: data['quote'],
              phrase: data['phrase'],
              islander: data['islander']
            }
          };
          return villager;
        });

        this.lastVillager = newVillagers[newVillagers.length - 1].attributes.name;

        const currentVillagers = this._villagers.value;
        const updatedVillagers = [...currentVillagers, ...newVillagers];

        this._villagers.next(updatedVillagers);
        observer.next(updatedVillagers);
        observer.complete();
      });
    });
  }

  public getFiltered(name: string): Villager[] {
    const filteredVillagers = this._villagers.value.filter(villager => {
      const villagerName = villager.attributes.name;
      return villagerName && villagerName.toLowerCase().includes(name.toLowerCase());
    });
    return filteredVillagers;
  }

  public getVillagerById(id: string): Villager | undefined {
    return this._villagers.value.find(villager => villager.id === id);
  }

}


