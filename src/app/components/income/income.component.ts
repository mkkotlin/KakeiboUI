import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Income, IncomeService } from '../../services/income.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-income',
  imports: [CommonModule, FormsModule, MatCardModule],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent implements OnInit{
  private incomeService = inject(IncomeService);
  incomes: Income[] = [];
  ngOnInit() {
    this.incomeService.getIncome().subscribe((data)=>{
      this.incomes = data;
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
    this.incomeService.addIncome(this.newIncome).subscribe({
      next:(res)=>{
        this.successMessage = 'Income addes';
        this.errorMessage ='';
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
