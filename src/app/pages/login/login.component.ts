import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";
import {AuthServiceService} from "../../services/auth-service.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
   RouterModule, ReactiveFormsModule, CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  message: string | null = null;
  alertClass: string | null = null;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private cookieService: CookieService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onButtonClick() {
    if (this.loginForm.valid) {
      username: this.loginForm.value.username
      password: this.loginForm.value.password
    }
  }
}
