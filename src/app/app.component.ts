import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from './services/search.service';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './components/auth/auth.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, CommonModule, AuthComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'KakeiboUI';
  public authService = inject(AuthService);
  private searchService = inject(SearchService);
  searchQuery = '';

  onSearchChange(event: Event) {
    this.searchService.setQuery(this.searchQuery);
  }
}
