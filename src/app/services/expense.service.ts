import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Expense{
    id: number;
    category: string;
    amount: string;
    date: string;
    notes: string;
}

@Injectable({ providedIn: 'root'})
export class ExpenseService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://127.0.0.1:8000/api/expenses/';

  // Fetch from api
  getExpense(): Observable<Expense[]>{
    const username = this.authService.currentUser?.username || 'admin';
    return this.http.get<Expense[]>(`${this.apiUrl}?username=${username}`);
  }

  getCategories(): Observable<any[]>{
    return this.http.get<any[]>('http://127.0.0.1:8000/api/categories/');
  }
  // Add using api
  addExpense(expense: Expense){
    const username = this.authService.currentUser?.username || 'admin';
    const payload = { ...expense, username };
    return this.http.post(this.apiUrl, payload);
  }

  // Delete
  deleteExpense(id:number){
    return this.http.delete(`${this.apiUrl}${id}/delete/`);
  }
}
