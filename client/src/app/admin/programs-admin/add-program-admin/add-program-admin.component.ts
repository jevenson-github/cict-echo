import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  selector: 'app-add-program-admin',
  templateUrl: './add-program-admin.component.html',
  styleUrls: ['./add-program-admin.component.css']
})

export class AddProgramAdminComponent implements OnInit {

  constructor(private http: HttpClient, private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) { }

  detailsArray: Program[] = [];
  membersArray: any[] = [];
  partnerArray: any[] = [];
  userArray: any[] = [];
  editorConfig: any;
  form!: FormGroup;
  submitForm: boolean = false;
  addLoading: boolean = false;

  ngOnInit(): void {

    this.validateAddProgram();

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

  // //validate form
  validateAddProgram() {
    this.form = this.formBuilder.group({
      title: [null, Validators.required],
      initiative: [null, Validators.required],
      location: [null, Validators.required],
      partner: [null],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      lead:[null],
      participants: [null, Validators.required],
      details: [null, Validators.required],
      flow: [null, Validators.required],
      additionalDetails: [null, Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  addProgram() {
    // Insert code here
    this.submitForm = true;

    if (this.form.invalid) {
      return;
    }

    var formData = new FormData();
    formData.append("title", this.form.controls['title'].value);
    formData.append("initiative", this.form.controls['initiative'].value);
    formData.append("location", this.form.controls['location'].value);
    formData.append("partner", this.form.controls['partner'].value);
    formData.append("start_date", this.form.controls['startDate'].value);
    formData.append("end_date", this.form.controls['endDate'].value);
    formData.append("lead", this.form.controls['lead'].value);
    formData.append("participants", this.form.controls['participants'].value);
    formData.append("details", this.form.controls['details'].value);
    formData.append("flow", this.form.controls['flow'].value);
    formData.append("additional_details", this.form.controls['additionalDetails'].value);

    this.addLoading = true;
    this.http.post(environment.apiUrl + '/program/create', formData).subscribe((resultData: any) => {
      this.addLoading = false;
      console.log(resultData);
      this.router.navigate(['management/programs']);
    });

    this.submitForm = false;
 
  }

}
