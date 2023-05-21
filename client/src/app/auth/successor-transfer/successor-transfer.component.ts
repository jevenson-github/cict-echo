import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-successor-transfer',
  templateUrl: './successor-transfer.component.html',
  styleUrls: ['./successor-transfer.component.css']
})
export class SuccessorTransferComponent {

  constructor(private router: Router, private http: HttpClient) { }

  adminArray: any;
  successorArray: any;

  adminId: any;
  successorId: any;

  adminFirstName: any;
  adminLastName: any;
  successorFirstName: any;
  successorLastName: any;

  loading: boolean = false;

  ngOnInit(): void {
    this.http.get(environment.apiUrl + "/user/get-admin").subscribe((resultData: any) => {
      this.adminArray = resultData;
      this.adminId = this.adminArray[0].id;
      this.adminFirstName = this.adminArray[0].first_name;
      this.adminLastName = this.adminArray[0].last_name;
      
    });

    this.http.get(environment.apiUrl + "/user/get-successor").subscribe((resultData: any) => {
      this.successorArray = resultData;
      this.successorId = this.successorArray[0].id;
      this.successorFirstName = this.successorArray[0].first_name;
      this.successorLastName = this.successorArray[0].last_name;
    });
  }

  acceptTransfer() {
    this.http.post(environment.apiUrl + "/user/accept-transer", '').subscribe((resultData: any) => {
    });

  }

}
