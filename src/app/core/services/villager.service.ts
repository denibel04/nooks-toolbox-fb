import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PaginatedVillagers, Villager } from '../interfaces/villager'; // Asegúrate de que el path es correcto
import { environment } from 'src/environments/environment.prod';
import { DataService } from './api/strapi/data.service';
import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root'
})
export class VillagerService {

  constructor(
    private dataService: DataService,
    private api: ApiService
  ) { }

  private _villagers: BehaviorSubject<PaginatedVillagers> = new BehaviorSubject<PaginatedVillagers>({ data: [], pagination: { page: 0, pageCount: 0, pageSize: 0, total: 0 } });
  public villagers$: Observable<PaginatedVillagers> = this._villagers.asObservable();

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

  public getFiltered(q:string):Observable<Villager[]>{
    return this.api.get(`/villagers?filters[name][$startsWithi]=${q}`).pipe(
      map(response => {
        return response.data;
      })
    );
  }


  public getVillager(id: number): Observable<Villager> {
    return this.api.get(`/villagers/${id}`).pipe(
      map(response => {
        return response.data;
      })
    );
  }
}


