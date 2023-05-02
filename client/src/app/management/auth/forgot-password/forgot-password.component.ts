import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder) { }


  formSignIn!: FormGroup;
  submitted = false;
  messageHolder:any;


  ngOnInit(): void {
    this.formSignIn = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  get f() {
    return this.formSignIn.controls;
  }

  email: string = '';

  forgotPasswordLoading: boolean = false;

  sendResetInstructions() {
    this.submitted = true;


    if (this.formSignIn.invalid) {
      return;
    }

    

    const queryParams = {
      'forgotPasswordResponse': 'success',
      'email': this.formSignIn.value.email
    };



    
    this.http.post('http://127.0.0.1:8000/api/auth/send-reset-link', this.formSignIn.value).subscribe(response => {
      console.log(response);
      this.messageHolder = response;
      if (this.messageHolder.status == 'Successful') {
        // alert(this.messageHolder.message);
        
        this.router.navigate(['/auth'], { queryParams: queryParams });
      }

      else if (this.messageHolder.status == 'Error') {
        this.submitted = false;
        // alert(this.messageHolder.message);
        this.formSignIn.reset();
        this.router.navigate(['/auth'], { queryParams: queryParams });
      }
    });
  }

}
