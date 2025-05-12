import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense.service';

@Component({
  selector: 'app-expense',
  imports: [CommonModule, FormsModule,],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit{



  private expenseService = inject(ExpenseService);
  expenses: Expense[] = [];
  ngOnInit(){
    this.expenseService.getExpense().subscribe((data: any[])=>{
      this.expenses = data;
      this.filteredExpenses = data;
      this.uniqueCategory = [...new Set(data.map(d=>d.category))]
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
        date: new Date().toISOString().split('T')[0],
        notes: '',
        id:0,
      };
      this.ngOnInit();
    })
  }

  delete(id:number){
    this.expenseService.deleteExpense(id).subscribe(()=>{
      this.expenses = this.expenses.filter(expense => expense.id !== id);
      this.ngOnInit();
    })
  }

  filterCategory: string = '';
  filterDate: string = '';
  uniqueCategory: string[] = [];
  filteredExpenses: any [] =[];
  applyFilters(){
    this.filteredExpenses = this.expenses.filter(expense => {
      const matchCategory = this.filterCategory? expense.category === this.filterCategory: true;
      const matchDate = this.filterDate? expense.date === this.filterDate: true;
      return matchCategory && matchDate;
    })
  };
  resetFilters(){
    this.filterCategory = '';
    this.filterDate = '';
    this.filteredExpenses = [...this.expenses]
  };


}
