import { RouterModule, Routes } from '@angular/router';
import { ExpenseComponent } from './components/expense/expense.component';
import { IncomeComponent } from './components/income/income.component';

export const routes: Routes = [
    { path: 'expense', component: ExpenseComponent},
    { path: 'income', component: IncomeComponent},
    {path: '', redirectTo: '/', pathMatch:'full'},
    { path: '**', redirectTo:''},
];