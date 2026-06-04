import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  private authService = inject(AuthService);

  isSignUpMode = false;
  
  // Login Form fields
  loginUsername = '';
  loginPassword = '';
  
  // Register Form fields
  regUsername = '';
  regEmail = '';
  regPassword = '';

  errorMessage = '';
  successMessage = '';

  toggleMode() {
    this.isSignUpMode = !this.isSignUpMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmitLogin() {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.loginUsername || !this.loginPassword) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.authService.login(this.loginUsername, this.loginPassword).subscribe({
      next: (res) => {
        this.successMessage = 'Login successful!';
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Invalid username or password.';
      }
    });
  }

  onSubmitRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.regUsername || !this.regEmail || !this.regPassword) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }

    if (this.regPassword.length < 4) {
      this.errorMessage = 'Password must be at least 4 characters.';
      return;
    }

    this.authService.register(this.regUsername, this.regEmail, this.regPassword).subscribe({
      next: (res) => {
        this.successMessage = 'Account created successfully! Please sign in.';
        // Pre-fill login username and switch modes
        this.loginUsername = this.regUsername;
        this.regUsername = '';
        this.regEmail = '';
        this.regPassword = '';
        setTimeout(() => {
          this.isSignUpMode = false;
          this.successMessage = 'Registration successful! Enter password to login.';
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
      }
    });
  }
}
