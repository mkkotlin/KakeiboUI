import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Income{
    id:number;
    source:string;
    amount:string;
    date:string;
    notes:string;
}

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/income/'

  getIncome(): Observable<Income[]>{
    return this.http.get<Income[]>(this.apiUrl)
  }

  addIncome(income: Income){
    return this.http.post(this.apiUrl,income)
  }

  deleteIncome(id:number){
    return this.http.delete(`${this.apiUrl}${id}/delete/`);
  }
}
