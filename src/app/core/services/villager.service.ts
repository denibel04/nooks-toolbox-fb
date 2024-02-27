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
  ) { }

  private _villagersPaginated: BehaviorSubject<PaginatedVillagers> = new BehaviorSubject<PaginatedVillagers>({ data: [], pagination: { page: 0, pageCount: 0, pageSize: 0, total: 0 } });
  public villagersPaginated$: Observable<PaginatedVillagers> = this._villagersPaginated.asObservable();

  private _villagers: BehaviorSubject<Villager[]> = new BehaviorSubject<Villager[]>([])
  public villagers$: Observable<Villager[]> = this._villagers.asObservable();

  public queryPaginated(page: number): Observable<PaginatedVillagers> {
    const paginationParams = `pagination[page]=${page}`;
    return this.dataService.queryPaginated<any>('villagers', paginationParams).pipe(
      map(response => ({
        data: response.data,
        pagination: response.pagination
      })))
  }

  public query(q: string): Observable<PaginatedVillagers> {
    return this.dataService.query<any>('villagers', {}).pipe(
      map(response => ({
        data: response.data,
        pagination: response.pagination
      })))
  }

  public getVillagers(): Observable<Villager[]> {
    return new Observable(observer => {
      this.fbSvc.getDocuments("villagers").then(villagerDocuments => {
        //console.log(villagerDocuments);
        const villagers = villagerDocuments.map(doc => {
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
          //console.log(villager)
          return villager; 
        });
        this._villagers.next(villagers); 
        observer.next(villagers); 
        observer.complete(); 
      }).catch(error => {
        console.error('Error al obtener villagers:', error);
        observer.error(error); // Pasamos el error al observer
      });
    });
  }

  public getFiltered(q: string): Observable < Villager[] > {
  return this.api.get(`/villagers?filters[name][$startsWithi]=${q}`).pipe(
    map(response => {
      return response.data;
    })
  );
}


  public getVillager(id: number): Observable < Villager > {
  return this.api.get(`/villagers/${id}`).pipe(
    map(response => {
      return response.data;
    })
  );
}
}


