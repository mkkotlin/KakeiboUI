import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Income, IncomeService } from '../../services/income.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { SearchService } from '../../services/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-income',
  imports: [CommonModule, FormsModule, MatCardModule, ReactiveFormsModule],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent implements OnInit, OnDestroy {
  private incomeService = inject(IncomeService);
  private searchService = inject(SearchService);
  
  incomes: Income[] = [];
  filteredIncomes: Income[] = [];
  searchQuery = '';
  private searchSub!: Subscription;

  private fb = inject(FormBuilder);
  incomeForm!: FormGroup;

  ngOnInit() {
    this.loadIncomes();

    this.incomeForm = this.fb.group({
      source: ['', Validators.required],
      amount: ['',[Validators.required, Validators.min(1)]],
      date: ['',Validators.required],
      notes: ['']
    });

    this.searchSub = this.searchService.query$.subscribe(query => {
      this.searchQuery = query;
      this.applySearchFilter();
    });
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }

  loadIncomes() {
    this.incomeService.getIncome().subscribe((data)=>{
      this.incomes = data;
      this.applySearchFilter();
    });
  }

  applySearchFilter() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.filteredIncomes = [...this.incomes];
    } else {
      this.filteredIncomes = this.incomes.filter(item => 
        item.source.toLowerCase().includes(q) || 
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    }
  }

  newIncome: Income = {
    source: '',
    amount: '',
    date: '',
    notes: '',
    id: 0,
  }


  // Submit income using api
  successMessage=''
  errorMessage=''
  submitIncome(){

    if(this.incomeForm.invalid){ this.incomeForm.markAllAsTouched();
      this.errorMessage = "Please fill required field";
      return;
    }

    const formData = this.incomeForm.value;
    this.incomeService.addIncome(formData).subscribe({
      next:(res)=>{
        this.successMessage = 'Income added';
        this.errorMessage ='';
        this.incomeForm.reset();
      this.newIncome = {
            source: '',
            amount: '',
            date: '',
            notes: '',
            id: 0,
      }
      this.loadIncomes();
    },
    error: (err)=>{
      this.errorMessage = "Failed to save";
      this.successMessage=''
    }
    })
  }

  delete(id:number){
    this.incomeService.deleteIncome(id).subscribe(()=>{
      this.loadIncomes();
    })
  }

}
