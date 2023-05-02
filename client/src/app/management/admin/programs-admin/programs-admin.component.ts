import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-programs-admin',
  templateUrl: './programs-admin.component.html',
  styleUrls: ['./programs-admin.component.css']
})
export class ProgramsAdminComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private formBuilder2: FormBuilder,
    private http: HttpClient,
  ) { };

  ngOnInit() {
    this.fetchPrograms();
    this.indexPrograms();
    this.getPartners();
    this.getUsers();
  }

  //Search related
  filteredProgramArray: any;
  p: number = 1;

  clearSearch() {
    this.filteredProgramArray = '';
  }

  //Toast
  showToast() {
    if (this.updateToast === true || this.deleteToast === true || this.postToast === true ||
        this.addToast === true || this.markAsCompleteToast === true || this.addMemberRoleToast === true ) {
      setTimeout(() => {
        this.updateToast = false;
        this.deleteToast = false;
        this.postToast = false;
        this.addToast = false;
        this.markAsCompleteToast = false;
        this.addMemberRoleToast = false;
      }, 5000);
    }
  }

  //Get Programs
  programs: any[] = [];
  program_id: any;
  partnerArray: any[] = [];
  userArray: any[] = [];
  membersArray: any[] = [];
  detailsArray: any[] = [];

  fetchPrograms(): Observable<any> {
    return this.http.get('http://127.0.0.1:8000/api/program/index-program');
  }

  indexPrograms() {
    this.fetchPrograms().subscribe((resultData: any) => {
      this.programs = resultData;
    });
  }

  getPartners() {
    this.http.get('http://127.0.0.1:8000/api/partner/get-partner-active').subscribe((resultData:any) => {
    this.partnerArray = resultData;
    console.log(resultData);
    });
  }

  //GETTING ALL USERS DATA
  getUsers() {
    this.http.get('http://127.0.0.1:8000/api/user/verified-user').subscribe((resultData:any) => {
    this.userArray = resultData;
    console.log(resultData);
    });
  }

  setIdForViewProgram(data: any){
    this.program_id = data.id;
  }

  getPrograms() {

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

  //View Program Function
  viewModal: boolean = false;

  program_name: any;//
  start_date: any;//
  end_date: any;//
  program_location: any;//
  program_details: any;//
  program_lead: any;//
  program_participants: any;//
  program_flow: any;//
  additional_details: any;
  partner_company: any;//
  program_members: any;
  member_role: any;
  program_status: any;//

  viewProgramModal(data: any){
    this.program_id = data.id;
    this.viewModal = true;

    
    // this.program_name = data.program_title;
    // this.start_date = data.start_date;
    // this.end_date = data.end_date;
    // this.program_location = data.location;
    // this.program_details = data.program_details;
    // this.program_lead = data.program_lead_id;
    // this.program_participants = data.participants;
    // this.program_flow = data.program_flow;
    // this.additional_details = data.additional_details;
    // this.partner_company = data.partner_id;
    // this.program_members = data.program_members;
    // this.program_status = data.status;

    this.http.get('http://127.0.0.1:8000/api/program/get-program/'+ this.program_id).subscribe((resultData:any) => {

      this.detailsArray = resultData.programs;
      this.membersArray = resultData.members;
      
      console.log(this.detailsArray);
      console.log(this.detailsArray);
    });
  }

  //Update Program Function
  updateModal: boolean = false;
  updateLoading: boolean = false;
  updateToast: boolean = false;

  programID:any;
  programTitle:any;
  startDate:any;
  endDate:any;
  location:any;
  programDetails:any;
  programLead:any;
  programParticipants:any;
  flow:any;
  additionalDetails:any;
  partnerCompany:any;
  // programMembers:any;
  // memberRole:any;

  updateProgramModal(data: any){
    this.updateModal = true;
    this.program_id = data.id;

    this.programID = data.id;
    this.programTitle = data.program_title;
    this.startDate = data.start_date;
    this.endDate = data.end_date;
    this.location = data.location;
    this.programDetails = data.program_details;
    this.programLead = data.program_lead_id;
    this.programParticipants = data.participants;
    this.flow = data.program_flow;
    this.additionalDetails = data.additional_details;
    this.partnerCompany = data.partner_id;
    //this.programMembers = data.program_members
  }

  updateProgram(){
    let bodyData = {
      "program_title" : this.programTitle,
      "start_date" : this.startDate,
      "end_date" : this.endDate,
      "location" : this.location,
      "program_details" : this.programDetails,
      "program_lead_id" : this.programLead,
      "participants" : this.programParticipants,
      "program_flow" : this.flow,
      "additional_details" : this.additionalDetails,
      "partner_id" : this.partnerCompany,
      //"program_members" : this.programMembers,
      //"member_role" : this.memberRole
    }


    this.updateLoading = true;
    this.http.post('http://127.0.0.1:8000/api/program/update'+ '/' + this.program_id, bodyData).subscribe(response => {
        console.log(response);
        this.updateLoading = false;
        this.updateModal = false;
        this.updateToast = true;
        this.showToast();
        this.ngOnInit();
      });
  }

  //Add Members and Role Functiom
  addMemberRoleModal: boolean = false;
  addMemberRoleLoading: boolean = false;
  addMemberRoleToast: boolean = false;

  addProgramMember: any;
  addProgramRole: any;

  addMemberRoleProgramModal(data: any){
    this.addMemberRoleModal = true;
    this.program_id = data.id;
  }

  addMemberRoleProgram(){
    let bodyData = {
      "program_id": this.program_id,
      "program_members" : this.addProgramMember,
      "member_role" : this.addProgramRole
    }

    this.addMemberRoleLoading = true;
    this.http.post('http://127.0.0.1:8000/api/program/add-member-role', bodyData).subscribe(response => {
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

  postProgramModal(data: any){
    this.postModal = true;
    this.program_id = data.id;

  }

  postProgram(){
    this.postLoading = true;
    this.http.post('http://127.0.0.1:8000/api/program/post'+ '/' + this.program_id, '').subscribe(response => {
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

  setUploadID:any;

  submitProgramFiles = false;
  certificateFile:any;
  attendanceFile:any;
  invitationFile:any;
  form2!:FormGroup;

  programCertificateUpload(event:any) {
    this.certificateFile = event.target.files[0];
    console.log(this.certificateFile);
  }

  programAttendanceUpload(event:any) {
    this.attendanceFile = event.target.files[0];
    console.log(this.attendanceFile);
  }

  programInvitationUpload(event:any) {
    this.invitationFile = event.target.files[0];
    console.log(this.invitationFile);
  }

  get u() {
    return this.form2.controls;
  }


  markAsCompleteProgramModal(data: any){
    this.markAsCompleteModal = true;
    this.program_id = data.id;

    this.setUploadID = data.id;

    this.form2 = this.formBuilder2.group({
      certificate_file: [null, Validators.required],
      attendance_file: [null, Validators.required],
      invitation_file: [null, Validators.required]
    });

  }

  markAsCompleteProgram(){

    this.submitProgramFiles = true;
    if(this.form2.invalid) {
      return;
    }
    var formDataUpload = new FormData();
    formDataUpload.append("certificate_file", this.certificateFile, this.certificateFile.name);
    formDataUpload.append("attendance_file", this.attendanceFile, this.attendanceFile.name);
    formDataUpload.append("invitation_file", this.invitationFile, this.attendanceFile.name);

    this.markAsCompleteLoading = true;
    this.http.post('http://127.0.0.1:8000/api/program/complete' + '/' + this.setUploadID, formDataUpload).subscribe(response => {
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

  deleteProgramModal(data: any){
    this.deleteModal = true;
    this.program_id = data.id;

  }

  deleteProgram(){
    this.deleteLoading = true;
    this.http.delete('http://127.0.0.1:8000/api/program/delete'+ '/' + this.program_id).subscribe(response => {
        console.log(response);
        this.deleteLoading = false;
        this.deleteModal = false;
        this.deleteToast = true;
        this.showToast();
        this.ngOnInit();
    });
  }

  // Add Program
  addModal: boolean = false;
  addLoading: boolean = false;
  addToast: boolean = false;

  form!: FormGroup;
  submitProgram = false;

  addProgramModal(){
    this.addModal = true

    this.form = this.formBuilder.group({
      title: [null, Validators.required],
      sDate: [null, Validators.required],
      eDate: [null, Validators.required],
      loc: [null, Validators.required],
      details: [null, Validators.required],
      particip: [null, Validators.required],
      flow: [null, Validators.required],
      addDetails: [null, Validators.required],
      progLeadID: [null, Validators.required],
      partID: [null, Validators.required],
      // program_members: [null, Validators.required],
      //member_role: [null, Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  addProgram(){
    this.submitProgram = true;

    if (this.form.invalid) {
      return;
    }

    var programData = new FormData();
    programData.append("program_title", this.form.controls['title'].value);
    programData.append("start_date", this.form.controls['sDate'].value);
    programData.append("end_date", this.form.controls['eDate'].value);
    programData.append("location", this.form.controls['loc'].value);
    programData.append("program_details", this.form.controls['details'].value);
    programData.append("participants", this.form.controls['particip'].value);
    programData.append("program_flow", this.form.controls['flow'].value);
    programData.append("additional_details", this.form.controls['addDetails'].value);
    programData.append("program_lead_id", this.form.controls['progLeadID'].value);
    programData.append("partner_id", this.form.controls['partID'].value);
    // programData.append("program_members", '');
    // programData.append("member_role", '');

    this.addLoading = true;
    this.http.post('http://127.0.0.1:8000/api/program/create', programData).subscribe((response: any) => {
        console.log(response);
        this.addLoading = false;
        this.addModal = false;
        this.addToast = true;
        this.showToast();
        this.ngOnInit();
    });
  }

}