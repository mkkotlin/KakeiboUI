import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { ExpenseService, Expense } from '../../services/expense.service';
import { IncomeService, Income } from '../../services/income.service';
import { SearchService } from '../../services/search.service';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  date: string;
  notes: string;
  category: string;
}

interface CategoryBreakdown {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private expenseService = inject(ExpenseService);
  private incomeService = inject(IncomeService);
  private searchService = inject(SearchService);

  totalIncome = 0;
  totalExpense = 0;
  netBalance = 0;
  savingsRate = 0;

  recentTransactions: Transaction[] = [];
  allRecentTransactions: Transaction[] = [];
  categoryBreakdown: CategoryBreakdown[] = [];
  
  // Chart values
  chartPoints = '';
  chartExpensePoints = '';
  chartDates: string[] = [];
  chartMaxVal = 0;

  searchQuery = '';
  private searchSub!: Subscription;

  ngOnInit() {
    this.loadData();
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

  loadData() {
    forkJoin({
      expenses: this.expenseService.getExpense(),
      incomes: this.incomeService.getIncome()
    }).subscribe({
      next: ({ expenses, incomes }) => {
        this.calculateMetrics(expenses, incomes);
        this.generateRecentTransactions(expenses, incomes);
        this.calculateCategoryBreakdown(expenses);
        this.generateChartData(expenses, incomes);
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
      }
    });
  }

  calculateMetrics(expenses: Expense[], incomes: Income[]) {
    this.totalIncome = incomes.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0);
    this.totalExpense = expenses.reduce((sum, item) => sum + parseFloat(item.amount || '0'), 0);
    this.netBalance = this.totalIncome - this.totalExpense;
    this.savingsRate = this.totalIncome > 0 ? (this.netBalance / this.totalIncome) * 100 : 0;
    if (this.savingsRate < 0) this.savingsRate = 0;
  }

  generateRecentTransactions(expenses: Expense[], incomes: Income[]) {
    const mappedIncomes: Transaction[] = incomes.map(item => ({
      id: item.id,
      type: 'income',
      title: item.source || 'Income Source',
      amount: parseFloat(item.amount || '0'),
      date: item.date,
      notes: item.notes,
      category: 'Income'
    }));

    const mappedExpenses: Transaction[] = expenses.map(item => ({
      id: item.id,
      type: 'expense',
      title: item.category || 'Uncategorized',
      amount: parseFloat(item.amount || '0'),
      date: item.date,
      notes: item.notes,
      category: item.category
    }));

    // Merge and sort by date descending
    this.allRecentTransactions = [...mappedIncomes, ...mappedExpenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    this.applySearchFilter();
  }

  applySearchFilter() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.recentTransactions = this.allRecentTransactions.slice(0, 5);
    } else {
      this.recentTransactions = this.allRecentTransactions.filter(tx => 
        tx.title.toLowerCase().includes(q) || 
        (tx.notes && tx.notes.toLowerCase().includes(q)) ||
        tx.category.toLowerCase().includes(q)
      );
    }
  }

  calculateCategoryBreakdown(expenses: Expense[]) {
    const categoryTotals: { [key: string]: number } = {};
    expenses.forEach(exp => {
      const cat = exp.category || 'Others';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + parseFloat(exp.amount || '0');
    });

    const colors: { [key: string]: string } = {
      'Food': '#ef4444',
      'Entertainment': '#3b82f6',
      'Bills': '#f59e0b',
      'Others': '#10b981',
      'Uncategorized': '#6b7280'
    };

    const breakdown: CategoryBreakdown[] = [];
    Object.keys(categoryTotals).forEach(cat => {
      const amt = categoryTotals[cat];
      const percentage = this.totalExpense > 0 ? (amt / this.totalExpense) * 100 : 0;
      breakdown.push({
        name: cat,
        amount: amt,
        percentage: Math.round(percentage),
        color: colors[cat] || '#8b5cf6'
      });
    });

    this.categoryBreakdown = breakdown.sort((a, b) => b.amount - a.amount);
  }

  generateChartData(expenses: Expense[], incomes: Income[]) {
    // Group transaction sums by date for the last 7 distinct transaction dates
    const dailyData: { [date: string]: { income: number; expense: number } } = {};
    
    // Collect all dates
    const allDates = new Set<string>();
    incomes.forEach(i => {
      const d = i.date ? i.date.split('T')[0] : '';
      if (d) allDates.add(d);
    });
    expenses.forEach(e => {
      const d = e.date ? e.date.split('T')[0] : '';
      if (d) allDates.add(d);
    });

    const sortedDates = Array.from(allDates).sort().slice(-7); // Last 7 days
    this.chartDates = sortedDates;

    sortedDates.forEach(date => {
      dailyData[date] = { income: 0, expense: 0 };
    });

    incomes.forEach(item => {
      const d = item.date ? item.date.split('T')[0] : '';
      if (dailyData[d]) {
        dailyData[d].income += parseFloat(item.amount || '0');
      }
    });

    expenses.forEach(item => {
      const d = item.date ? item.date.split('T')[0] : '';
      if (dailyData[d]) {
        dailyData[d].expense += parseFloat(item.amount || '0');
      }
    });

    // Create SVG points
    // Width is 500, Height is 150
    const pointsIncome: string[] = [];
    const pointsExpense: string[] = [];
    
    let maxVal = 100;
    sortedDates.forEach(date => {
      const inc = dailyData[date].income;
      const exp = dailyData[date].expense;
      if (inc > maxVal) maxVal = inc;
      if (exp > maxVal) maxVal = exp;
    });
    this.chartMaxVal = maxVal;

    sortedDates.forEach((date, index) => {
      const x = 50 + (index * 65);
      const inc = dailyData[date].income;
      const exp = dailyData[date].expense;
      
      // Calculate Y coordinate (inverted in SVG)
      const yInc = 130 - (inc / maxVal * 100);
      const yExp = 130 - (exp / maxVal * 100);
      
      pointsIncome.push(`${x},${yInc}`);
      pointsExpense.push(`${x},${yExp}`);
    });

    this.chartPoints = pointsIncome.join(' ');
    this.chartExpensePoints = pointsExpense.join(' ');
  }
}
