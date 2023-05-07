import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-view-program-admin',
  templateUrl: './view-program-admin.component.html',
  styleUrls: ['./view-program-admin.component.css']
})
export class ViewProgramAdminComponent implements OnInit {

  programID: any;
  detailsArray: any[] = [];
  membersArray: any[] = [];


  constructor(private http: HttpClient, private route: ActivatedRoute, private formBuilder2: FormBuilder) { }

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

  }

  computeDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.abs(end.getTime() - start.getTime());

    const years = Math.floor(duration / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor(duration / (1000 * 60 * 60 * 24 * 30));
    const weeks = Math.floor(duration / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));

    if (years >= 1) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else if (months >= 1) {
      return `${months} month${months > 1 ? 's' : ''}`;
    } else if (weeks >= 1) {
      return `${weeks} week${weeks > 1 ? 's' : ''}`;
    } else {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  //Add Members and Role Functiom
  addMemberRoleModal: boolean = false;
  addMemberRoleLoading: boolean = false;
  addMemberRoleToast: boolean = false;

  addProgramMember: any;
  addProgramRole: any;

  addMemberRoleProgramModal() {
    this.addMemberRoleModal = true;
  }

  addMemberRoleProgram() {
    let bodyData = {
      "program": this.programID,
      "members": this.addProgramMember,
      "role": this.addProgramRole
    }

    this.addMemberRoleLoading = true;
    this.http.post(environment.apiUrl + '/program/add-member-role', bodyData).subscribe(response => {
      console.log(response);
      this.addMemberRoleLoading = false;
      this.addMemberRoleModal = false;
      this.addMemberRoleToast = true;
      this.addProgramMember = '';
      this.addProgramRole = '';
      this.showToast();
      this.ngOnInit();
    });

  }

  //Post Program Function
  postModal: boolean = false;
  postLoading: boolean = false;
  postToast: boolean = false;

  postProgramModal() {
    this.postModal = true;
  }

  postProgram() {
    this.postLoading = true;
    this.http.post(environment.apiUrl + '/program/post' + '/' + this.programID, '').subscribe(response => {
      console.log(response);
      this.postLoading = false;
      this.postModal = false;
      this.postToast = true;
      this.showToast();
      this.ngOnInit();
    });
  }

  //Mark as Complete Functioe
  markAsCompleteModal: boolean = false;
  markAsCompleteLoading: boolean = false;
  markAsCompleteToast: boolean = false;

  submitProgramFiles = false;
  certificateFile: any;
  attendanceFile: any;
  invitationFile: any;
  form2!: FormGroup;

  programCertificateUpload(event: any) {
    this.certificateFile = event.target.files[0];
    console.log(this.certificateFile);
  }

  programAttendanceUpload(event: any) {
    this.attendanceFile = event.target.files[0];
    console.log(this.attendanceFile);
  }

  programInvitationUpload(event: any) {
    this.invitationFile = event.target.files[0];
    console.log(this.invitationFile);
  }

  get u() {
    return this.form2.controls;
  }


  markAsCompleteProgramModal() {
    this.markAsCompleteModal = true;

    this.form2 = this.formBuilder2.group({
      certificate_file: [null, Validators.required],
      attendance_file: [null, Validators.required],
      invitation_file: [null, Validators.required]
    });

  }

  markAsCompleteProgram() {

    this.submitProgramFiles = true;
    if (this.form2.invalid) {
      return;
    }
    var formDataUpload = new FormData();
    formDataUpload.append("certificate_file", this.certificateFile, this.certificateFile.name);
    formDataUpload.append("attendance_file", this.attendanceFile, this.attendanceFile.name);
    formDataUpload.append("invitation_file", this.invitationFile, this.attendanceFile.name);

    this.markAsCompleteLoading = true;
    this.http.post(environment.apiUrl + '/program/complete' + '/' + this.programID, formDataUpload).subscribe(response => {
      console.log(response);
      this.markAsCompleteLoading = false;
      this.markAsCompleteModal = false;
      this.markAsCompleteToast = true;
      this.showToast();
      this.ngOnInit();
    });
  }

  //Delete Program
  deleteModal: boolean = false;
  deleteLoading: boolean = false;
  deleteToast: boolean = false;

  deleteProgramModal() {
    this.deleteModal = true;
  }

  deleteProgram() {
    this.deleteLoading = true;
    this.http.delete(environment.apiUrl + '/program/delete' + '/' + this.programID).subscribe(response => {
      console.log(response);
      this.deleteLoading = false;
      this.deleteModal = false;
      this.deleteToast = true;
      this.showToast();
      this.ngOnInit();
    });
  }

  showToast() {
    if (this.deleteToast === true || this.postToast === true || this.markAsCompleteToast === true || this.addMemberRoleToast === true ) {
      setTimeout(() => {
        this.deleteToast = false;
        this.postToast = false;
        this.markAsCompleteToast = false;
        this.addMemberRoleToast = false;
      }, 5000);
    }
  }



}
