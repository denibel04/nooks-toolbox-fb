import { Injectable } from '@angular/core';
import { Loan } from '../interfaces/loan';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { ApiService } from './api/api.service';
import { map, tap } from 'rxjs/operators';
import { DataService } from './api/strapi/data.service';
import { IslandService } from './island.service';
import { Island } from '../interfaces/island';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private _loans: BehaviorSubject<Loan[]> = new BehaviorSubject<Loan[]>([]);
  public loans$: Observable<Loan[]> = this._loans.asObservable();
  private path = "/loans"

  constructor(
    private dataService:DataService,
    private api: ApiService,
    private islandService:IslandService
  ) { 

  }

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
  }

  public deleteLoan(loan:Loan):Observable<Loan> {
    return this.dataService.delete<any>(`loans/${loan.id}`).pipe(tap(_=>{
      this.getAll().subscribe();
    }))
  }

  public updateLoan(loan:Loan):Observable<Loan> {
    return this.dataService.put<any>(`loans/${loan.id}`, loan.attributes).pipe(tap(_=>{
      this.getAll().subscribe();
    }))
  }
}
