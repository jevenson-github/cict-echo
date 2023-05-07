import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
}


@Component({
  selector: 'app-edit-program-admin',
  templateUrl: './edit-program-admin.component.html',
  styleUrls: ['./edit-program-admin.component.css']
})
export class EditProgramAdminComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  detailsArray: Program[] = [];
  membersArray: any[] = [];
  partnerArray: any[] = [];
  userArray: any[] = [];

  editorConfig: any;

  programID: any;

  content = '';

  onContentChange() {
    console.log('Content changed:', this.content);
  }

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
      plugins: ['quickbars', 'table'],
      quickbars_selection_toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table' ,
      quickbars_insert_toolbar: false,
      toolbar: false,
    };
  }

  updateProgram() {
    const programData = {
      title: this.detailsArray[0].title,
      name: this.detailsArray[0].name,
      start_date: this.detailsArray[0].start_date,
      end_date: this.detailsArray[0].end_date,
      location: this.detailsArray[0].location,
      details: this.detailsArray[0].details,
      lead: this.detailsArray[0].lead,
      partner: this.detailsArray[0].name,
      participants: this.detailsArray[0].participants,
      flow: this.detailsArray[0].flow,
      additional_details: this.detailsArray[0].additional_details
    };
    
    this.http.post(environment.apiUrl + '/program/update/' + this.programID, programData).subscribe((resultData: any) => {
      console.log(resultData);
    });
  }
  

}
