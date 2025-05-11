import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense.service';

@Component({
  selector: 'app-expense',
  imports: [CommonModule, FormsModule],
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

  newExpense: Expense = {
    category: '',
    amount: '',
    date: '',
    notes: '',
    id: 0,
  };

  categories = [
    {id:1, name:'Entertainment'},
    {id:2, name:'Food'},
    {id:3, name:'Bills'},
    {id:4, name:'Others'},
  ]

  // Submit expenses
  submitExpense(){
    this.expenseService.addExpense(this.newExpense).subscribe((res)=>{
      this.newExpense = {
        category: '',
        amount: '',
        date: '',
        notes: '',
        id:0,
      };
      this.ngOnInit();
    })
  }

}
