import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Villager } from '../interfaces/villager'; // Asegúrate de que el path es correcto
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class VillagerService {
  private _villagers:BehaviorSubject<Villager[]> = new BehaviorSubject<Villager[]>([]);
  public villagers$:Observable<Villager[]> = this._villagers.asObservable();

  private currentPage = 1;

  constructor(private http: HttpClient) {}

  // Método para cargar la primera página de datos o reiniciar la lista.
  public loadInitialVillagers() {
    this.currentPage= 1;
    this.loadMoreVillagers();
  }

  // Método para cargar más datos.
  public loadMoreVillagers() {
    this.http.get<{ data: Villager[] }>(`${environment.apiUrl}/villagers?pagination[page]=${this.currentPage}&pagination[pageSize]=50`)
      .pipe(map(response => response.data))
      .subscribe(
        data => {
          if (data.length === 0) {
            return;
          }
          const currentVillagers = this._villagers.value;
          const updatedVillagers = [...currentVillagers, ...data];
          this._villagers.next(updatedVillagers);
          this.currentPage += 1;
        },
        error => console.error('Error fetching villagers', error)
      );
  }
}

/*
  
  public getAll():Observable<Villager[]> {
    return this.http.get<Villager[]>(environment.apiUrl+'/villagers').pipe(tap(Villagers=>{
      this._villagers.next(Villagers);
    }));
  }*/


