import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  constructor(private http: HttpClient, private router: Router) { }

  email: string = '';

  forgotPasswordLoading: boolean = false;

  sendResetInstructions() {
    const queryParams = {
      'forgotPasswordResponse': 'success',
      'email': this.email
    };

    this.router.navigate(['/auth'], { queryParams: queryParams });
  }

}
