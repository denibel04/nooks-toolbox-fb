import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Island } from '../interfaces/island';
import { ApiService } from './api/api.service';
import { map, tap } from 'rxjs/operators';
import { DataService } from './api/strapi/data.service';


@Injectable({
  providedIn: 'root'
})
export class IslandService {

  private _islands: BehaviorSubject<Island[]> = new BehaviorSubject<Island[]>([]);
  public islands$: Observable<Island[]> = this._islands.asObservable();
  private path = "/islands"

  constructor(
    private dataService:DataService,
    private api: ApiService
  ) { }

    public getAll() {
      const params = { 'populate': 'villagers' };
    
      return this.api.get(this.path, params).pipe(
        map((response: any) => {
          return response.data.map((islandData: any) => {
            return {
              id: islandData.id,
              attributes: {
                islandName: islandData.attributes.islandName,
                villagers: islandData.attributes.villagers ? islandData.attributes.villagers.data.map((villager: any) => ({
                  id: villager.id,
                  attributes: villager.attributes
                })) : []
              }
            };
          });
        }), tap(islands=> {
          this._islands.next(islands)
        })
      );
    }

    public addIsland(is:Island):Observable<Island> {
      return this.dataService.post<Island>("islands", is).pipe(tap(_=>{
        this.getAll().subscribe();
      }))
    }

    public deleteIsland(is:Island):Observable<Island> {
      return this.dataService.delete<any>(`islands/${is.id}`).pipe(tap(_=>{
        this.getAll().subscribe();
      }))
    }

    public updateIsland(is:Island):Observable<Island> {
      return this.dataService.put<any>(`islands/${is.id}`, is).pipe(tap(_=>{
        this.getAll().subscribe();
      }))
    }
}
