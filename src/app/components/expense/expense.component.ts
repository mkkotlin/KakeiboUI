import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { ExpenseService, Expense } from '../../services/expense.service';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-expense',
  imports: [CommonModule, FormsModule, RouterModule,],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit, OnDestroy {
  private expenseService = inject(ExpenseService);
  private searchService = inject(SearchService);
  
  expenses: Expense[] = [];
  searchQuery = '';
  private searchSub!: Subscription;

  ngOnInit(){
    this.expenseService.getExpense().subscribe((data: any[])=>{
      this.expenses = data;
      this.applyFilters();
      this.uniqueCategory = [...new Set(data.map(d=>d.category))]
    });

    this.expenseService.getCategories().subscribe((cats: any[]) => {
      this.categories = cats;
    });

    this.searchSub = this.searchService.query$.subscribe(query => {
      this.searchQuery = query;
      this.applyFilters();
    });
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }

  newExpense: Expense = {
    category: '',
    amount: '',
    date: '',
    notes: '',
    id: 0,
  };

  categories: any[] = [];

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
      this.loadExpenses();
    })
  }

  loadExpenses() {
    this.expenseService.getExpense().subscribe((data: any[])=>{
      this.expenses = data;
      this.applyFilters();
      this.uniqueCategory = [...new Set(data.map(d=>d.category))]
    });
  }

  delete(id:number){
    this.expenseService.deleteExpense(id).subscribe(()=>{
      this.expenses = this.expenses.filter(expense => expense.id !== id);
      this.loadExpenses();
    })
  }

  filterCategory: string = '';
  filterDate: string = '';
  uniqueCategory: string[] = [];
  filteredExpenses: any [] =[];

  applyFilters(){
    const q = this.searchQuery.trim().toLowerCase();
    this.filteredExpenses = this.expenses.filter(expense => {
      const matchCategory = this.filterCategory? expense.category === this.filterCategory: true;
      const matchDate = this.filterDate? expense.date === this.filterDate: true;
      const matchSearch = q ? (
        expense.category.toLowerCase().includes(q) ||
        (expense.notes && expense.notes.toLowerCase().includes(q))
      ) : true;
      return matchCategory && matchDate && matchSearch;
    });
  }

  resetFilters(){
    this.filterCategory = '';
    this.filterDate = '';
    this.applyFilters();
  }
}
