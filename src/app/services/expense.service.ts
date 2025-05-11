import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  // private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private apiUrl = 'http://127.0.0.1:8000/api/expenses/';
  // Fetch from api
  getExpense(): Observable<Expense[]>{
    return this.http.get<Expense[]>(this.apiUrl);
  }
  // Add using api
  addExpense(expense: Expense){
    return this.http.post(this.apiUrl,expense);
  }

  // Delete
  deleteExpense(id:number){
    return this.http.delete(`${this.apiUrl}${id}/delete/`);
  }
}
