import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { Subject } from 'rxjs';


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})



export class DashboardAdminComponent implements OnInit {

  greeting: string | undefined;
  firstName: string | undefined;
  userData: any;
  token: any;

  stats: any = {};

  constructor(private elementRef: ElementRef, private router: Router, private http: HttpClient, private fb: FormBuilder, private fb2: FormBuilder) {
    this.token = localStorage.getItem('token');
    this.userData = jwt_decode(this.token);
    this.firstName = this.userData.firstName;
  }
  
  ngOnInit(): void {
    this.http.get(environment.apiUrl + '/dashboard/stats-count').subscribe(
      data => {
        this.stats = data;
      },
      error => {
        console.log(error);
      }
    );

    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      this.greeting = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      this.greeting = 'Good afternoon';
    } else if (hour >= 18 && hour < 22) {
      this.greeting = 'Good evening';
    } else {
      this.greeting = 'Good night';
    }
  }

}