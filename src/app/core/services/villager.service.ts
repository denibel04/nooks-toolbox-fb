import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedVillagers, Villager } from '../interfaces/villager';
import { DataService } from './api/strapi/data.service';
import { ApiService } from './api/api.service';
import { FirebaseService } from './api/firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class VillagerService {

  constructor(
    private dataService: DataService,
    private fbSvc: FirebaseService,
    private api: ApiService
  ) { }

  private _villagers: BehaviorSubject<Villager[]> = new BehaviorSubject<Villager[]>([])
  public villagers$: Observable<Villager[]> = this._villagers.asObservable();

  lastVillager: any = null;

  /**
   *  Retrieves a paginated list of villagers. Adds 25 villagers to the list each time its called.
   * @returns {Observable<Villager[]>} 
   */
  public getPaginatedVillagers(): Observable<Villager[]> {
    return new Observable(observer => {
      this.fbSvc.getDocumentsPaginated("villagers", 25, "name", this.lastVillager).then(villagersPaginated => {
        const newVillagers = villagersPaginated.map(doc => {
          const data = doc.data;
          if (data && data['name']) {
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
          } else {
            return undefined;
          }

        }).filter((villager): villager is Villager => villager !== undefined);
        if (newVillagers.length > 0) {
          this.lastVillager = newVillagers[newVillagers.length - 1].attributes.name;
        }

        const currentVillagers = this._villagers.value;
        const updatedVillagers = [...currentVillagers, ...newVillagers];

        this._villagers.next(updatedVillagers);
        observer.next(updatedVillagers);
        observer.complete();
      });
    });
  }

  /**
   * Retrieves a list of villagers filtered by name.
   * @param name The name of the villager to filter.
   * @returns {Promise<Villager[]>}
   */
  public async getFiltered(name: string): Promise<Villager[]> {
    const villagersFiltered = await this.fbSvc.getDocumentsFiltered("villagers", "name", name, true);
    const villagers: Villager[] = [];

    villagersFiltered.forEach(doc => {
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
      villagers.push(villager);
    });

    return villagers;
  }

  /**
   * Retrieves a villager by name.
   * @param name The name of the villager to retrieve.
   * @returns {Promise<Villager | undefined>} 
   */
  public async getVillagerByName(name: string): Promise<Villager | undefined> {
    const docs = await this.fbSvc.getDocumentsBy("villagers", "name", name);
    if (docs.length > 0) {
      const data = docs[0].data;
      return {
        id: docs[0].id,
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
    } else {
      return undefined;
    }
  }

}


