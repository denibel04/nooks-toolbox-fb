import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, asyncScheduler, lastValueFrom } from 'rxjs';
import { Island } from '../interfaces/island';
import { ApiService } from './api/api.service';
import { map, tap } from 'rxjs/operators';
import { DataService } from './api/strapi/data.service';
import { AuthStrapiService } from './api/strapi/auth-strapi.service';


@Injectable({
  providedIn: 'root'
})
export class IslandService {

  private _islands: BehaviorSubject<Island[]> = new BehaviorSubject<Island[]>([]);
  public islands$: Observable<Island[]> = this._islands.asObservable();
  private path = "/islands"

  constructor(
    private dataService: DataService,
    private api: ApiService,
    private authService:AuthStrapiService
  ) { }

  public getIsland(id: number) {
    const params = { 'populate': 'villagers' };
  
    return this.api.get(`${this.path}/${id}`, params).pipe(
      map((response: any) => {
        const islandData = response.data;
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
      }));
  }

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
      }), tap(islands => {
        this._islands.next(islands)
      })
    );
  }

  public addIsland(is: Island){
    return this.dataService.post<Island>("islands", is).subscribe({
      next:async (data:Island)=>{
        const id = {data: { island:data.id}}
        console.log(id)
        const user = await lastValueFrom(this.authService.me());
        await lastValueFrom(this.api.put(`/extended-users/${user.extended_id}`, id))
      } 
    })
  }

  public deleteIsland(is: Island): Observable<Island> {
    return this.dataService.delete<any>(`islands/${is.id}`).pipe(tap(_ => {
      this.getAll().subscribe();
    }))
  }

  public updateIsland(is: Island): Observable<Island> {
    return this.dataService.put<any>(`islands/${is.id}`, is.attributes).pipe(tap(_ => {
      this.getAll().subscribe();
    }))
  }
}
