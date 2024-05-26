import { Injectable } from '@angular/core';
import { Loan } from '../interfaces/loan';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { ApiService } from './api/api.service';
import { map, tap } from 'rxjs/operators';
import { DataService } from './api/strapi/data.service';
import { IslandService } from './island.service';
import { Island } from '../interfaces/island';
import { FirebaseAuthService } from './api/firebase/firebase-auth.service';
import { FirebaseService } from './firebase/firebase.service';
import { DocumentData } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private _loans: BehaviorSubject<Loan[]> = new BehaviorSubject<Loan[]>([]);
  public loans$: Observable<Loan[]> = this._loans.asObservable();

  constructor(
    private fbAuth: FirebaseAuthService,
    private fbSvc: FirebaseService,
    private isSvc: IslandService
  ) { }
  
  public addLoan(loan:Loan):Observable<Loan> {
    return new Observable(observer => {
      this.fbAuth.user$.subscribe(user => {
        this.isSvc.getUserIsland().subscribe(is => {
          this.fbSvc.createDocument(`users/${user!.uuid}/island/${is.id}/loans`, loan)
        })
      })
    })
  }

  public getUserLoans(): Observable<Loan[]> {
    return new Observable(observer => {
      this.fbAuth.user$.subscribe(user => {
        if (user) {
          this.isSvc.getUserIsland().subscribe(is => {
            const collectionName = `users/${user!.uuid}/island/${is.id}/loans`;
            this.fbSvc.subscribeToCollection(
              collectionName,
                this._loans,
              (doc: DocumentData) => ({
                id: doc['id'],
                attributes: {
                  type: doc['data']()['type'],
                  amountPaid: doc['data']()['amountPaid'],
                  amountTotal: doc['data']()['amountTotal'],
                  completed: doc['data']()['completed'],
                  title: doc['data']()['title']
                }
              })
            );
          });
        }
      });
    });
  }

  public deleteLoan(loan:Loan):Observable<Loan> {
    return new Observable(observer => {
      this.fbAuth.user$.subscribe(user => {
        this.isSvc.getUserIsland().subscribe(is => {
          this.fbSvc.deleteDocument(`users/${user!.uuid}/island/${is.id}/loans`, loan.id)
        })
      })
    })
  }

  public updateLoan(loan:Loan):Observable<Loan> {
    return new Observable(observer => {
      this.fbAuth.user$.subscribe(user => {
        console.log("loan user", user)
        this.isSvc.getUserIsland().subscribe(is => {
          this.fbSvc.updateDocument(`users/${user!.uuid}/island/${is.id}/loans`, loan.id, loan.attributes)
        })
      })
    })
  }
}
