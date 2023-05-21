import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';


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
  selectedStatus: string | undefined;

  fromDate: Date | undefined;
  toDate: Date | undefined;

  terminalLoading: boolean = false;
  terminalToast: boolean = false;
  monthlyLoading: boolean = false;
  monthlyToast: boolean = false;
  extensionLoading: boolean = false;
  extensionToast: boolean = false;
  facultyLoading: boolean = false;
  facultyToast: boolean = false;

  onDateRangeChange(fromDate: Date, toDate: Date) {
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

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
    this.showToast();
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

  terminalGenerate() {
    this.terminalLoading = true;
    const partnerId = (document.getElementById('partner') as HTMLSelectElement).value;
    // Use the partner ID to fetch the contract file from the server
    this.http.get(environment.apiUrl + '/report/terminal/' + partnerId, { responseType: 'blob' })
      .subscribe(response => {
        // Create a URL for the contract file
        const url = window.URL.createObjectURL(response);

        // Create a link element and click it to start the download
        const link = document.createElement('a');
        link.href = url;
        link.download = '[TERMINAL REPORT] ' + partnerId + '.pdf';
        link.click();
        this.terminalLoading = false;
        this.terminalModal = false;
        this.terminalToast = true;
        this.showToast();
      });
  }

  monthlyDownload() {
    this.monthlyLoading = true;
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
        this.monthlyLoading = false;
        this.monthlyModal = false;
        this.monthlyToast = true;
        this.showToast();
      });
  }

  downloadExtensions() {
    this.extensionLoading = true;
    const status = (document.getElementById('status') as HTMLSelectElement).value;
    const startDate = (document.getElementById('startDate') as HTMLInputElement).value;
    const endDate = (document.getElementById('endDate') as HTMLInputElement).value;
    const requestData = { status, startDate, endDate };

    // Use the partner ID and month/year to fetch the contract file from the server
    this.http.post(environment.apiUrl + '/report/partners', requestData, { responseType: 'blob' })
      .subscribe(response => {
        // Create a URL for the contract file
        const url = window.URL.createObjectURL(response);

        // Create a link element and click it to start the download
        const link = document.createElement('a');
        link.href = url;
        link.download = `list-partners.pdf`;
        link.click();
        this.extensionLoading = false;
        this.extensionModal = false;
        this.extensionToast = true;
        this.showToast();
      });

  }

  facultyDownload() {
    this.facultyLoading = true;
    const facultyId = (document.getElementById('faculty') as HTMLSelectElement).value;
    const startDate = (document.getElementById('startDate') as HTMLInputElement).value;
    const endDate = (document.getElementById('endDate') as HTMLInputElement).value;
    const requestData = { facultyId, status, startDate, endDate };
    // Use the partner ID to fetch the contract file from the server
    this.http.post(environment.apiUrl + '/report/extension-faculty', requestData, { responseType: 'blob' })
      .subscribe(response => {
        // Create a URL for the contract file
        const url = window.URL.createObjectURL(response);

        // Create a link element and click it to start the download
        const link = document.createElement('a');
        link.href = url;
        link.download = `contract-${facultyId}.pdf`;
        link.click();
        this.facultyLoading = false;
        this.facultyModal = false;
        this.facultyToast = true;
        this.showToast();
      });
  }

  showToast() {
    if (this.terminalToast === true || this.monthlyToast === true || this.extensionToast === true || this.facultyToast === true) {
      setTimeout(() => {
        this.terminalToast = false;
        this.monthlyToast = false;
        this.extensionToast = false;
        this.facultyToast = false;
      }, 5000);
    }
  }

}
