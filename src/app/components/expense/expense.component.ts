import { Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense.service';

@Component({
  selector: 'app-expense',
  imports: [CommonModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit{
  private expenseService = inject(ExpenseService);
  expenses: Expense[] = [];
  ngOnInit(){
    this.expenseService.getExpense().subscribe((data)=>{
      this.expenses = data;
    })
  }

}
