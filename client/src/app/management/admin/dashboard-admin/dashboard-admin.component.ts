import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import * as Highcharts from 'highcharts';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  counts: any;
  partners: any[] = [];
  barchart :any; 
  userarray : any[] = [];  
  verifiedcount : any[] = [];  

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getCounts();
    this.getExpiringPartners();
    this.loadchart();
    
  }

  getCounts() {
    const apiUrl = "http://127.0.0.1:8000/api/counts"; // Replace with the appropriate API endpoint
    this.http.get<any>(apiUrl).subscribe(
      response => {
        this.counts = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  getExpiringPartners() {
    const apiUrl = "http://127.0.0.1:8000/api/partner/expiring-partners"; // Replace with the appropriate API endpoint
    this.http.get<any[]>(apiUrl).subscribe(
      response => {
        this.partners = response;
        this.calculateCountdown();
      },
      error => {
        console.log(error);
      }
    );
  }

  calculateCountdown() {
    const currentDate = new Date();
    this.partners.forEach(partner => {
      const endDate = new Date(partner.end_date);
      const timeDiff = endDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff >= 0) {
        partner.countdown = `Expires in ${daysDiff} day${daysDiff > 1 ? 's' : ''}`;
      } else {
        partner.countdown = 'Expired';
      }
    });
  }

  // highcharts 

  loadchart(){ 

    

    this.http.get('http://127.0.0.1:8000/api/statistic-data').subscribe((resultData:any) => {

      this.userarray = resultData.users;
      console.log(this.userarray);

      });


     for (var val of this.userarray) {
      this.verifiedcount.push(val.first_name);

      console.log(this.verifiedcount);
     }
      


    this.barchart = new Chart({
      chart: {
        type: 'area'
      }, 
      xAxis:{ 
        categories: this.verifiedcount
      }, 

      yAxis:{
        title:{
          text: 'Number of Verified Users'
        }
      },
      title: {
        text: ''
      }, 
      credits:{
        enabled:false
      }, 
      legend:{
        backgroundColor: '#FFF45F',
      },
      plotOptions:{
        area:{
          fillOpacity:0.1, 
        }
      }, 
      series: [
        {
      
          name: 'Sample',
          // color: '#FF0000',
          // type: 'spline',
          data:[5, 3, 4, 7, 2]
        }as any
      ]








    }); 
  }

  
  
  
}
