import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
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

  register(username: string, email: string, password: string): boolean {
    const usersJson = localStorage.getItem('kakeibo_users') || '[]';
    const users = JSON.parse(usersJson) as any[];

    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return false; // User already exists
    }

    users.push({ username, email, password });
    localStorage.setItem('kakeibo_users', JSON.stringify(users));
    return true;
  }

  login(username: string, password: string): boolean {
    const usersJson = localStorage.getItem('kakeibo_users') || '[]';
    const users = JSON.parse(usersJson) as any[];

    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (user) {
      this.isLoggedIn = true;
      this.currentUser = { username: user.username };
      localStorage.setItem('kakeibo_session', user.username);
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUser = null;
    localStorage.removeItem('kakeibo_session');
  }
}
