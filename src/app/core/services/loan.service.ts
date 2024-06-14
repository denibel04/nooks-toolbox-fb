import { Injectable } from '@angular/core';
import { Loan } from '../interfaces/loan';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { ApiService } from './api/api.service';
import { map, tap } from 'rxjs/operators';
import { DataService } from './api/strapi/data.service';
import { IslandService } from './island.service';
import { Island } from '../interfaces/island';
import { FirebaseAuthService } from './api/firebase/firebase-auth.service';
import { FirebaseService } from './api/firebase/firebase.service';
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

  /**
   * Adds a loan to the user's island.
   * @param loan Loan object containing loan details.
   * @returns { Observable<Loan>}
   */
  public addLoan(loan: Loan): Observable<Loan> {
    return new Observable(observer => {
      this.fbAuth.user$.subscribe(user => {
        this.isSvc.getUserIsland().subscribe(is => {
          this.fbSvc.createDocument(`users/${user!.uuid}/island/${is.id}/loans`, loan)
        })
      })
    })
  }

  /**
   * Retrieves loans associated with the current user's island.
   * @returns { Observable<Loan[]>}
   */
  public getUserLoans(): Observable<Loan[]> {
    return new Observable(observer => {
      this.fbAuth.user$.subscribe(user => {
        if (user) {
          this.isSvc.getUserIsland().subscribe(is => {
            if (is) {
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
            } else {
              observer.next([]);
              this._loans.next([])
              observer.complete();
              return;
            }
          });
        }
      });
    });
  }

  /**
   * Retrieves loans associated with a specific user's island by user UUID.
   * @param uuid UUID of the user whose loans are to be retrieved.
   * @returns {Observable<Loan[]>}
   */
  public getUserLoanById(uuid: string): Observable<Loan[]> {
    return new Observable(observer => {
      this.isSvc.getUserIsland().subscribe(is => {
        if (is) {
          this.fbSvc.getDocuments(`users/${uuid}/island/${is.id}/loans`).then(loansDoc => {
            if (loansDoc.length === 0) {
              observer.next([]);
              observer.complete();
            } else {
              const loans = loansDoc.map(doc => {
                const data = doc.data;
                const loan:Loan = {
                  id: doc['id'],
                  attributes: {
                    type: data['type'],
                    amountPaid: data['amountPaid'],
                    amountTotal: data['amountTotal'],
                    completed: data['completed'],
                    title: data['title']
                  }
                };
                return loan;
              })
              observer.next(loans);
              observer.complete();
            }
          })
        } else {
          observer.next([]);
          observer.complete();
          return;
        }
      });
    });
  }

  /**
   * Deletes a loan associated with the current user's island.
   * @param loan Loan object representing the loan to be deleted.
   * @returns {Observable<Loan>}
   */
  public deleteLoan(loan: Loan): Observable<Loan> {
    return new Observable(observer => {
      this.fbAuth.user$.subscribe(user => {
        this.isSvc.getUserIsland().subscribe(is => {
          this.fbSvc.deleteDocument(`users/${user!.uuid}/island/${is.id}/loans`, loan.id)
        })
      })
    })
  }

   /**
   * Updates a loan associated with the current user's island.
   * @param loan Loan object representing the loan to be updated.
   * @returns {Observable<Loan>}
   */
  public updateLoan(loan: Loan): Observable<Loan> {
    return new Observable(observer => {
      this.fbAuth.user$.subscribe(user => {
        this.isSvc.getUserIsland().subscribe(is => {
          this.fbSvc.updateDocument(`users/${user!.uuid}/island/${is.id}/loans`, loan.id, loan.attributes)
        })
      })
    })
  }
}
