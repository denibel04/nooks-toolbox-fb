import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Island } from '../interfaces/island';
import { ApiService } from './api/api.service';
import { DataService } from './api/strapi/data.service';
import { AuthStrapiService } from './api/strapi/auth-strapi.service';
import { FirebaseAuthService } from './api/firebase/firebase-auth.service';
import { FirebaseService } from './firebase/firebase.service';
import { VillagerService } from './villager.service';
import { Villager } from '../interfaces/villager';


@Injectable({
  providedIn: 'root'
})
export class IslandService {

  private _islands: BehaviorSubject<Island | null> = new BehaviorSubject<Island | null>(null);
  public islands$: Observable<Island | null> = this._islands.asObservable();
  private path = "/islands"

  constructor(
    private fbSvc: FirebaseService,
    private fbAuth: FirebaseAuthService,
    private villagerService: VillagerService
  ) { }

  public addIsland(is: any): Observable<Island> {
    return new Observable(observer => {
      let villagers = []
      for (let i = 1; i <= 10; i++) {
        if (is[`villager${i}`]) {
          villagers.push({ id: is[`villager${i}`] });
        }
      }
      const postdata = {
        islandName: is.islandName,
        hemisphere: is.hemisphere,
        villagers: villagers,
        loans: []
      }
      this.fbAuth.user$.subscribe(user => {
        this.fbSvc.createDocument(`users/${user!.uuid}/island`, postdata).then(() => {
          observer.complete();
        })

      })

    })
  }

  public getUserIsland(): Observable<Island> {
    return new Observable(observer => {
      this.fbAuth.user$.subscribe(user => {
        if (user) {
          this.fbSvc.getDocuments(`users/${user!.uuid}/island`).then(isDoc => {
            console.log("GET DOCUMETS GETUSERISLAND", isDoc)
            if (isDoc.length === 0) {
              observer.next(undefined);
              observer.complete();
              return;
            } else {
              const villagerPromises = isDoc[0].data['villagers'].map((villagerId: { id: string }) => {
                return this.villagerService.getVillagerByName(villagerId.id);
              });
              console.log("vp", villagerPromises)
              Promise.all(villagerPromises).then(completeVillagers => {
                const island: Island = {
                  id: isDoc[0]['id'],
                  attributes: {
                    islandName: isDoc[0].data['islandName'],
                    hemisphere: isDoc[0].data['hemisphere'],
                    villagers: completeVillagers,
                    loans: isDoc[0].data['loans']
                  }
                };
                observer.next(island);
                observer.complete();
                this._islands.next(island);
              });
            }
          });
        }
      });
    });
  }


  public deleteIsland(is: Island): Observable<Island> {
    return new Observable(observer => {
      console.log("AFSGDSDFDS", is.id);
      this.fbAuth.user$.subscribe(user => {
        this.fbSvc.deleteDocument(`users/${user!.uuid}/island`, is.id).then(() => {
          observer.complete();
          this._islands.next(null);
        })
      })
    })
  }

  public updateIsland(is: Island, info: any): Observable<Island> {
    let villagers = []
    for (let i = 1; i <= 10; i++) {
      if (info.data[`villager${i}`]) {
        if (typeof info.data[`villager${i}`] === 'object')
          villagers.push({ id: info.data[`villager${i}`].attributes.name });
        else
          villagers.push({ id: info.data[`villager${i}`] });
      }
    }
    const postdata = {
      islandName: info.data.islandName,
      hemisphere: is.attributes.hemisphere,
      villagers: villagers
    }
    return new Observable(observer => {
      let user = this.fbSvc.user
      this.fbSvc.updateDocument(`users/${user!.uid}/island`, is.id, postdata).then(() => {
        observer.complete();
      })
      this.getUserIsland();
    })
  }
}
