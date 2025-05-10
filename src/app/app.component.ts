import { Component } from '@angular/core';
import { ExpenseComponent } from './components/expense/expense.component';
import { IncomeComponent } from './components/income/income.component';

@Component({
  selector: 'app-root',
  imports: [ExpenseComponent,IncomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KakeiboUI';
}
