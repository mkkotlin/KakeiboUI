import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/auth/';

  isLoggedIn = false;
  currentUser: { username: string } | null = null;

  constructor() {
    this.checkSession();
  }

  private checkSession() {
    const session = localStorage.getItem('kakeibo_session');
    if (session) {
      this.isLoggedIn = true;
      this.currentUser = { username: session };
    }
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}register/`, { username, email, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}login/`, { username, password }).pipe(
      tap(res => {
        if (res && res.username) {
          this.isLoggedIn = true;
          this.currentUser = { username: res.username };
          localStorage.setItem('kakeibo_session', res.username);
        }
      })
    );
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUser = null;
    localStorage.removeItem('kakeibo_session');
  }
}
