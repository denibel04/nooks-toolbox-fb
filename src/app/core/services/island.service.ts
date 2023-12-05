import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, asyncScheduler, lastValueFrom } from 'rxjs';
import { Island } from '../interfaces/island';
import { ApiService } from './api/api.service';
import { map, tap } from 'rxjs/operators';
import { DataService } from './api/strapi/data.service';
import { AuthStrapiService } from './api/strapi/auth-strapi.service';
import { User } from '../interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class IslandService {

  private _islands: BehaviorSubject<Island | null> = new BehaviorSubject<Island | null>(null);
  public islands$: Observable<Island | null> = this._islands.asObservable();
  private path = "/islands"

  constructor(
    private dataService: DataService,
    private api: ApiService,
    private authService:AuthStrapiService
  ) { }

  public addIsland(is: any): Observable<Island> {
    let villagers = []
    for (let i = 1; i <= 10; i++) {
      if (is[`villager${i}`]) {
        villagers.push({ id: is[`villager${i}`]});
      }
    }
      const postdata = {
          islandName: is.islandName,
          villagers: villagers
        
      }
      console.log("pd", postdata)
    return new Observable<Island>((observer) => {
      this.dataService.post<Island>("islands", postdata).subscribe({
        next: async (data: Island) => {
          const id = {data: { island: data.id }};
          console.log(id);
          const user = await lastValueFrom(this.authService.me());
          await lastValueFrom(this.api.put(`/extended-users/${user.extended_id}`, id));
          this.getUserIsland().subscribe();
          observer.next(data); 
          observer.complete(); 
        },
      });
    });
  }

  public getUserIsland(): Observable<Island> {
    return new Observable<Island>((observer) => {
      this.authService.me().subscribe({
        next: (user: User) => {
          this.getIsland(user.island.data.id).subscribe({
            next: (island: Island) => {
              this._islands.next(island); 
              observer.next(island);
              observer.complete();
            }
          });
        }
      });
    });
  }

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

  public deleteIsland(is: Island): Observable<Island> {
    return this.dataService.delete<any>(`islands/${is.id}`).pipe(tap(_ => {
      this._islands.next(null);
    }))
  }

  public updateIsland(is: Island, info:any): Observable<Island> {
    let villagers = []
    for (let i = 1; i <= 10; i++) {
      if (info.data[`villager${i}`]) {
        if (typeof info.data[`villager${i}`] === 'object')
          villagers.push({ id: info.data[`villager${i}`].id}); 
        else
        villagers.push({ id: info.data[`villager${i}`]});
      }
    }
      const postdata = {
          islandName: info.islandName,
          villagers: villagers
        
      }
      console.log(postdata)
    return this.dataService.put<any>(`islands/${is.id}`, postdata).pipe(tap(_ => {
      this.getUserIsland().subscribe();
    }))
  }
}
