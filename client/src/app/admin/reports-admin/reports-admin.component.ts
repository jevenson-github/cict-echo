import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';



@Component({
  selector: 'app-reports-admin',
  templateUrl: './reports-admin.component.html',
  styleUrls: ['./reports-admin.component.css']
})
export class ReportsAdminComponent implements OnInit {

  programArray: any[] = [];
  partnerArray: any[] = [];
  facultyArray: any[] = [];

  terminalModal: boolean = false;
  monthlyModal: boolean = false;
  extensionModal: boolean = false;
  facultyModal: boolean = false;

  selectedMonth: string | undefined;
  selectedYear: string | undefined;
  years: number[] = [];

  constructor(private http: HttpClient) {
    const currentYear = new Date().getFullYear();
    for (let i = 2000; i <= currentYear; i++) {
      this.years.push(i);
    }

    // Set the default selected month and year to the current month and year
    const currentMonth = new Date().getMonth() + 1;
    this.selectedMonth = currentMonth < 10 ? '0' + currentMonth : currentMonth.toString();
    this.selectedYear = currentYear.toString();
  };

  ngOnInit(): void {
    this.getPrograms();
    this.getPartners();
    this.getFaculty();
  }

  // all programs fetching
  getPrograms() {
    this.http.get(environment.apiUrl + '/program/index').subscribe((resultData: any) => {
      this.programArray = resultData;
      console.log(resultData);
    });
  }

  getPartners() {
    this.http.get(environment.apiUrl + '/partner/get-partner-active').subscribe((resultData: any) => {
      this.partnerArray = resultData;
      console.log(resultData);
    });
  }

  getFaculty() {
    this.http.get(environment.apiUrl + '/user/verified-user').subscribe((resultData: any) => {
      this.facultyArray = resultData;
      console.log(resultData);
    });
  }

  terminalDownload() {
    const partnerId = (document.getElementById('partner') as HTMLSelectElement).value;
    // Use the partner ID to fetch the contract file from the server
    this.http.get(environment.apiUrl + '/report/terminal/' + partnerId, { responseType: 'blob' })
        .subscribe(response => {
            // Create a URL for the contract file
            const url = window.URL.createObjectURL(response);

            // Create a link element and click it to start the download
            const link = document.createElement('a');
            link.href = url;
            link.download = `contract-${partnerId}.pdf`;
            link.click();
        });
  }

  monthlyDownload() {
    const year = this.selectedYear;
    const month = this.selectedMonth;
    const requestData = { year, month };

    // Use the partner ID and month/year to fetch the contract file from the server
    this.http.post(environment.apiUrl + '/report/accomplishment-monthly', requestData, { responseType: 'blob' })
        .subscribe(response => {
            // Create a URL for the contract file
            const url = window.URL.createObjectURL(response);

            // Create a link element and click it to start the download
            const link = document.createElement('a');
            link.href = url;
            link.download = `monthly-accomplishment-${year}-${month}.pdf`;
            link.click();
        });
  }

  downloadExtensions()  {
        // Use the partner ID and month/year to fetch the contract file from the server
        this.http.get(environment.apiUrl + '/report/partners/', { responseType: 'blob' })
        .subscribe(response => {
            // Create a URL for the contract file
            const url = window.URL.createObjectURL(response);
    
            // Create a link element and click it to start the download
            const link = document.createElement('a');
            link.href = url;
            link.download = `list-partners.pdf`;
            link.click();
        });
    
  }

  facultyDownload() {
    const facultyId = (document.getElementById('faculty') as HTMLSelectElement).value;
    // Use the partner ID to fetch the contract file from the server
    this.http.get(environment.apiUrl + '/report/extension-faculty/' + facultyId, { responseType: 'blob' })
        .subscribe(response => {
            // Create a URL for the contract file
            const url = window.URL.createObjectURL(response);

            // Create a link element and click it to start the download
            const link = document.createElement('a');
            link.href = url;
            link.download = `contract-${facultyId}.pdf`;
            link.click();
        });
  }

}
