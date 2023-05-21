import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  signUpResponse: string | undefined;
  transferResponse: string | undefined;
  forgotPasswordResponse: string | undefined;
  resetResponse: string | undefined;
  email: string | undefined;
  emailForgot: string | undefined;

  signInLoading: boolean = false;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.forgotPasswordResponse = params['forgotPasswordResponse'];
      this.emailForgot = params['emailForgot'];
    });
    this.route.queryParams.subscribe(params => {
      this.signUpResponse = params['signUpResponse'];
      this.email = params['email'];
    });
    this.route.queryParams.subscribe(params => {
      this.transferResponse = params['transferResponse'];
    });
    this.route.queryParams.subscribe(params => {
      this.resetResponse = params['resetResponse'];
    });
    this.formSignIn = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  formSignIn!: FormGroup;
  submitted = false;
  dataHolder: any;
  tokenHolder: any;
  wrongCredentials = false;
  pendingAccount = false

  get f() {
    return this.formSignIn.controls;
  }

  submitSignIn() {
    this.submitted = true;
    this.signInLoading = true;

    if (this.formSignIn.invalid) {
      this.signInLoading = false;
      return;
    }

    this.http.post(environment.apiUrl + '/auth/sign-in', this.formSignIn.value).subscribe(response => {
      this.signInLoading = false;
      this.dataHolder = response;

      if (this.dataHolder.status == 'invalid') {
        this.wrongCredentials = true;
      }

      else if (this.dataHolder.status == 'pending') {
        this.pendingAccount = true;
      }

      else if (this.dataHolder.status == 'verified') {
        this.tokenHolder = this.dataHolder.data;
        localStorage.setItem('token', this.tokenHolder);

        if (this.dataHolder.role == 'admin') {
          this.router.navigate(['management/']);
        }
        else if (this.dataHolder.role == 'faculty') {
          this.router.navigate(['faculty/']);
        }
      }

    });

    this.wrongCredentials = false;
    this.pendingAccount = false;
  }

}