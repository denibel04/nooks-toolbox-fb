import { Injectable } from '@angular/core';
import { Loan } from '../interfaces/loan';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api/api.service';
import { map, tap } from 'rxjs/operators';
import { DataService } from './api/strapi/data.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private _loans: BehaviorSubject<Loan[]> = new BehaviorSubject<Loan[]>([]);
  public loans$: Observable<Loan[]> = this._loans.asObservable();
  private path = "/loans"

  constructor(
    private dataService:DataService,
    private api: ApiService
  ) { }

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

  
  public addLoan(loan:Loan):Observable<Loan> {
    return this.dataService.post<Loan>("loans", loan).pipe(tap(_=>{
      this.getAll().subscribe();
    }))
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
