import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

interface Program {
  id: string;
  name: string;
  description: string;
  address: string;
  contact_person: string;
  contact_number: string;
  email: string;
  lead: string;
  partner: string;
  participants: string;
  flow: string;
  additional_details: string;
}

@Component({
  selector: 'app-edit-partner-admin',
  templateUrl: './edit-partner-admin.component.html',
  styleUrls: ['./edit-partner-admin.component.css']
})

export class EditPartnerAdminComponent {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  detailsArray: Program[] = [];
  programsArray: any[] = [];
  partnerArray: any[] = [];

  partnerID: any;

  content = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.partnerID = params['partnerID'];
      console.log(this.partnerID);
    });

    this.http.get(environment.apiUrl + '/partner/get-partner/' + this.partnerID).subscribe((resultData: any) => {

      this.programsArray = resultData.programs;
      this.partnerArray = resultData.partner;

      console.log(this.programsArray);
      console.log(this.partnerArray);
    });
  }

  // updateProgram() {
  //   var formData = new FormData();
  //   formData.append("name", this.name);
  //   formData.append("description", this.description);
  //   formData.append("address", this.address);
  //   formData.append("contact_person", this.contact_person);
  //   formData.append("contact_number", this.contact_number);
  //   formData.append("email", this.email);
  //   if (this.imageToUpdate) {
  //     formData.append("logo", this.imageToUpdate, this.imageToUpdate.name);
  //   }
    
  //   this.http.post(environment.apiUrl + '/partner/update-info' + '/' + this.partnerID, formData).subscribe((resultData: any) => {
  //     console.log(resultData);
  //   });
  // }

}
