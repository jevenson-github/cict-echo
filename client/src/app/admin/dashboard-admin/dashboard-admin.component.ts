import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { Chart } from 'chart.js';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { Subject } from 'rxjs';

interface ProgramsByMonthResponse {
  data: [number, number, number][],
  labels: string[]
}


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
  expiring: any = {};

  chart: any;

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

    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: [],
        datasets: []
      },
      options: {

      }
    });

    this.http.get<ProgramsByMonthResponse>(environment.apiUrl + '/dashboard/program-chart').subscribe(res => {
      const gradient = this.chart.ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(255, 99, 132, 0.5)');
      gradient.addColorStop(0.5, 'rgba(54, 162, 235, 0.5)');
      gradient.addColorStop(1, 'rgba(75, 192, 192, 0.5)');

      const chartData = {
        labels: res.labels,
        datasets: [
          {
            label: 'Upcoming Programs',
            data: res.data.map((d: [number, number, number]) => d[0]),
            fill: false,
            backgroundColor: gradient,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
          },
          {
            label: 'Ongoing Programs',
            data: res.data.map((d: [number, number, number]) => d[1]),
            fill: false,
            backgroundColor: gradient,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1,
          },
          {
            label: 'Completed Programs',
            data: res.data.map((d: [number, number, number]) => d[2]),
            fill: false,
            backgroundColor: gradient,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };

      const options = {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          filler: {
            propagate: true
          },
          'samples-filler-animated': {
            target: 'myChart'
          }
        },
        cubicInterpolationMode: 'monotone'
      };

      this.chart.data = chartData;
      this.chart.options = options;
      this.chart.update({
        duration: 1000,
        easing: 'linear'
      });
    });

    this.http.get(environment.apiUrl + '/dashboard/expiring-partners').subscribe(
      data => {
        this.expiring = data;
      },
      error => {
        console.log(error);
      }
    );

  }

  calculateDaysLeft(endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
    const today = new Date();
    const endDateObj = new Date(endDate);
    const daysLeft = Math.round(Math.abs((today.getTime() - endDateObj.getTime()) / oneDay));
    return daysLeft;
  }
  




}