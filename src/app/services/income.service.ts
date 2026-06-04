import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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
  private authService = inject(AuthService);
  private apiUrl = 'http://127.0.0.1:8000/api/income/'

  getIncome(): Observable<Income[]>{
    const username = this.authService.currentUser?.username || 'admin';
    return this.http.get<Income[]>(`${this.apiUrl}?username=${username}`);
  }

  addIncome(income: Income){
    const username = this.authService.currentUser?.username || 'admin';
    const payload = { ...income, username };
    return this.http.post(this.apiUrl, payload);
  }

  deleteIncome(id:number){
    return this.http.delete(`${this.apiUrl}${id}/delete/`);
  }
}
