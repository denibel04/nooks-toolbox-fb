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
    private dataService:DataService,
    private api: ApiService,
    private islandService:IslandService,
    private fbAuth: FirebaseAuthService,
    private fbSvc: FirebaseService,
    private isSvc: IslandService
  ) { }

  public getAll() {

  }
/*
  public getAll() {
    return this.api.get(this.path).pipe(
      map((response: any) => {
        return response.data.map((loanData: any) => {
          return {
            id: loanData.id,
            attributes: {
              type: loanData.attributes.type,
              amountPaid: loanData.attributes.amountPaid,
              amountTotal: loanData.attributes.amountTotal,
              completed: loanData.attributes.completed,
              title: loanData.attributes.title
            }
          };
        });
      }), tap(loans => {
        this._loans.next(loans)
      })
    );
  }

  public getUserLoans(): Observable<Loan[]> {
    return new Observable<Loan[]>((observer) => {
      this.islandService.getUserIsland().subscribe({
        next: (is: Island) => {
          this.api.get(`/loans?filters[island][id][$eq]=${is.id}&populate=island`).pipe(
            map((response: any) => {
              return response.data; 
            }),
            tap((loans: Loan[]) => {
              this._loans.next(loans);
            })
          ).subscribe((loans) => {
            observer.next(loans); 
            observer.complete(); 
            }
          );
        },
      });
    });
  }
*/
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

  /*
  public getUserLoans():Observable<Loan[]> {
    return new Observable(observer => {
      this.fbAuth.user$.subscribe(user => {
        if (user) {
          this.isSvc.getUserIsland().subscribe(is => {
            this.fbSvc.getDocuments(`users/${user!.uuid}/island/${is.id}/loans`).then(loansDoc => {
              const loans: Loan[] = loansDoc.map(doc => ({
                id: doc['id'],
                attributes: {
                  type: doc.data['type'],
                  amountPaid: doc.data['amountPaid'],
                  amountTotal: doc.data['amountTotal'],
                  completed: doc.data['completed'],
                  title: doc.data['title']
                }
              }));
              this._loans.next(loans);
              observer.next(loans);
              observer.complete();
            });
          })
        }
      })
    })
  }*/

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
        this.isSvc.getUserIsland().subscribe(is => {
          this.fbSvc.updateDocument(`users/${user!.uuid}/island/${is.id}/loans`, loan.id, loan.attributes)
        })
      })
    })
  }


  /*
  public addLoan(loan:Loan):Observable<Loan>{
    return new Observable<Loan>((observer)=>{
      this.dataService.post<Loan>("loans", loan).subscribe({
        next: async (data:Loan) => {
          const island = await lastValueFrom(this.islandService.getUserIsland());
          const id = {data:{island:island.id}};
          await lastValueFrom(this.api.put(`/loans/${data.id}`, id));
          this.getUserLoans().subscribe();
          observer.next(data);
          observer.complete();
        }
      })
    })
  }*/


/*
  public deleteLoan(loan:Loan):Observable<Loan> {
    return this.dataService.delete<any>(`loans/${loan.id}`).pipe(tap(_=>{
      this.getUserLoans().subscribe();
    }))
  }

  public async deleteLoansOnCascade(is:Island) {
    const loans:Loan[] = await lastValueFrom(this.getUserLoans()) 
    for (let loan of loans) {
      this.deleteLoan(loan).subscribe()
    }
    //this.islandService.deleteIsland(is).subscribe();
  }

  public updateLoan(loan:Loan):Observable<Loan> {
    return this.dataService.put<any>(`loans/${loan.id}`, loan.attributes).pipe(tap(_=>{
      this.getUserLoans().subscribe();
    }))
  }*/
}
