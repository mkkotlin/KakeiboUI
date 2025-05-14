import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Income, IncomeService } from '../../services/income.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-income',
  imports: [CommonModule, FormsModule, MatCardModule, ReactiveFormsModule],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent implements OnInit{
  private incomeService = inject(IncomeService);
  incomes: Income[] = [];
  private fb = inject(FormBuilder);
  incomeForm!: FormGroup;
  ngOnInit() {
    this.incomeService.getIncome().subscribe((data)=>{
      this.incomes = data;
    })

    this.incomeForm = this.fb.group({
      source: ['', Validators.required],
      amount: ['',[Validators.required, Validators.min(1)]],
      date: ['',Validators.required],
      notes: ['']

    })

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
        this.successMessage = 'Income addedd';
        this.errorMessage ='';
        this.incomeForm.reset();
      this.newIncome = {
            source: '',
            amount: '',
            date: '',
            notes: '',
            id: 0,
      }
      this.ngOnInit();
    },
    error: (err)=>{
      this.errorMessage = "Failed to save";
      this.successMessage=''
    }
    })
  }

  delete(id:number){
    this.incomeService.deleteIncome(id).subscribe(()=>{
      this.incomes = this.incomes.filter(income => income.id !== id)
    })
  }

}
