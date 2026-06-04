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

    const success = this.authService.login(this.loginUsername, this.loginPassword);
    if (!success) {
      this.errorMessage = 'Invalid username or password.';
    } else {
      this.successMessage = 'Login successful!';
    }
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

    const success = this.authService.register(this.regUsername, this.regEmail, this.regPassword);
    if (!success) {
      this.errorMessage = 'Username already exists. Please choose another one.';
    } else {
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
    }
  }
}
