import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Income, IncomeService } from '../../services/income.service';

@Component({
  selector: 'app-income',
  imports: [CommonModule],
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

}
