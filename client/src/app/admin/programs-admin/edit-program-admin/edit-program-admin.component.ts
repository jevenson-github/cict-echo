import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

interface Program {
  id: string;
  title: string;
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  details: string;
  lead: string;
  partner: string;
  participants: string;
  flow: string;
  additional_details: string;
  initiative: string;
}


@Component({
  selector: 'app-edit-program-admin',
  templateUrl: './edit-program-admin.component.html',
  styleUrls: ['./edit-program-admin.component.css']
})
export class EditProgramAdminComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  detailsArray: Program[] = [];
  membersArray: any[] = [];
  partnerArray: any[] = [];
  userArray: any[] = [];
  editorConfig: any;
  programID: any;
  editLoading: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.programID = params['programID'];
      console.log(this.programID);
    });

    this.http.get(environment.apiUrl + '/program/get-program/' + this.programID).subscribe((resultData: any) => {
      this.detailsArray = resultData.programs;
      this.membersArray = resultData.members;
      console.log(this.detailsArray);
    });

    this.http.get(environment.apiUrl + '/partner/get-partner-active').subscribe((resultData: any) => {
      this.partnerArray = resultData;
      console.log(resultData);
    });

    this.http.get(environment.apiUrl + '/user/verified-user').subscribe((resultData: any) => {
      this.userArray = resultData;
      console.log(resultData);
    });

    this.editorConfig = {  
      suffix: '.min',
      menubar: false,
      inline: true,
      plugins: ['quickbars', 'table', 'lists'],
      quickbars_selection_toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table' ,
      quickbars_insert_toolbar: false,
      toolbar: false,
      table_default_attributes: {
        border: '1',
        width: '100%'
      }
    };
  }

  updateProgram() {

    const programData = {
      title: this.detailsArray[0].title,
      start_date: this.detailsArray[0].start_date,
      end_date: this.detailsArray[0].end_date,
      location: this.detailsArray[0].location,
      details: this.detailsArray[0].details,
      lead: this.detailsArray[0].lead,
      partner: this.detailsArray[0].partner,
      participants: this.detailsArray[0].participants,
      flow: this.detailsArray[0].flow,
      initiative: this.detailsArray[0].initiative,
      additional_details: this.detailsArray[0].additional_details
    };
    
    this.editLoading = true;
    this.http.post(environment.apiUrl + '/program/update/' + this.programID, programData).subscribe((resultData: any) => {
      this.editLoading = false;
      console.log(resultData);
      this.router.navigate(['management/programs']);
    });
  }
  

}
