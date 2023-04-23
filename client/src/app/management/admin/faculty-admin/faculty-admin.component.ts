import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Modal } from 'flowbite'
import type { ModalOptions, ModalInterface } from 'flowbite'

@Component({
  selector: 'app-faculty-admin',
  templateUrl: './faculty-admin.component.html',
  styleUrls: ['./faculty-admin.component.css']
})

export class FacultyAdminComponent {

  constructor() { }

  updateModal: boolean = false;
  resignModal: boolean = false;
  reactivateModal: boolean = false;
  acceptModal: boolean = false;
  rejectModal: boolean = false;
  deleteModal: boolean = false;
  undoModal: boolean = false;
  removeModal: boolean = false;

  updateSelection: boolean = true;
  updateEmail: boolean = false;
  updateInfo: boolean = false;

  openRemoveModal() {
    this.removeModal = true;
  }

  closeRemoveModal() {
    this.removeModal = false;
  }

  openDeleteModal() {
    this.deleteModal = true;
  }

  closeDeleteModal() {
    this.deleteModal = false;
  }

  openUndoModal() {
    this.undoModal = true;
  }

  closeUndoModal() {
    this.undoModal = false;
  }

  openAcceptModal() {
    this.acceptModal = true;
  }

  closeAcceptModal() {
    this.acceptModal = false;
  }

  openRejectModal() {
    this.rejectModal = true;
  }

  closeRejectModal() {
    this.rejectModal = false;
  }

  openReactivateModal() {
    this.reactivateModal = true;
  }

  closeReactivateModal() {
    this.reactivateModal = false;
  }

  openResignModal() {
    this.resignModal = true;
  }

  closeResignModal() {
    this.resignModal = false;
  }

  openUpdateModal() {
    this.updateModal = true;
  }

  closeUpdateModal() {
    this.updateModal = false;
    this.updateSelection = true;
    this.updateEmail = false;
    this.updateInfo = false;
  }

  toUpdateInfo() {
    this.updateSelection = false;
    this.updateEmail = false;
    this.updateInfo = true;
  }

  toUpdateEmail() {
    this.updateSelection = false;
    this.updateEmail = true;
    this.updateInfo = false;
  }

  toUpdateSelection() {
    this.updateSelection = true;
    this.updateEmail = false;
    this.updateInfo = false;
  }

  verifiedFaculty: any[] = [
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/069280e57d5a8637ea2f1fb4301816da',
      name: 'Aaron Paul Dela Rosa',
      id: '2019XXXXXX',
      email: 'aaronpaul.delarosa@bulsu.edu.ph',
      department: 'BSIT',
      designation: 'Department Head'
    },
  ];

  resignedFaculty: any[] = [
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/069280e57d5a8637ea2f1fb4301816da',
      name: 'Aaron Paul Dela Rosa',
      id: '2019XXXXXX',
      email: 'aaronpaul.delarosa@bulsu.edu.ph',
      department: 'BSIT',
      designation: 'Department Head'
    },
  ];

  pendingFaculty: any[] = [
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/069280e57d5a8637ea2f1fb4301816da',
      name: 'Aaron Paul Dela Rosa',
      id: '2019XXXXXX',
      email: 'aaronpaul.delarosa@bulsu.edu.ph',
      department: 'BSIT',
      designation: 'Department Head'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/069280e57d5a8637ea2f1fb4301816da',
      name: 'Aaron Paul Dela Rosa',
      id: '2019XXXXXX',
      email: 'aaronpaul.delarosa@bulsu.edu.ph',
      department: 'BSIT',
      designation: 'Department Head'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/069280e57d5a8637ea2f1fb4301816da',
      name: 'Aaron Paul Dela Rosa',
      id: '2019XXXXXX',
      email: 'aaronpaul.delarosa@bulsu.edu.ph',
      department: 'BSIT',
      designation: 'Department Head'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/069280e57d5a8637ea2f1fb4301816da',
      name: 'Aaron Paul Dela Rosa',
      id: '2019XXXXXX',
      email: 'aaronpaul.delarosa@bulsu.edu.ph',
      department: 'BSIT',
      designation: 'Department Head'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/069280e57d5a8637ea2f1fb4301816da',
      name: 'Aaron Paul Dela Rosa',
      id: '2019XXXXXX',
      email: 'aaronpaul.delarosa@bulsu.edu.ph',
      department: 'BSIT',
      designation: 'Department Head'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/069280e57d5a8637ea2f1fb4301816da',
      name: 'Gabriel Galang',
      id: '2019XXXXXX',
      email: 'gabriel.galang@bulsu.edu.ph',
      department: 'BSIT',
      designation: 'Area Chair - Web and Mobile Development'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/069280e57d5a8637ea2f1fb4301816da',
      name: 'Welsie Vergara',
      id: '2019XXXXXX',
      email: 'welsie.vergara@bulsu.edu.ph',
      department: 'BLIS',
      designation: 'Department Head'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/069280e57d5a8637ea2f1fb4301816da',
      name: 'Renato Adriano',
      id: '2019XXXXXX',
      email: 'renato.adriano@bulsu.edu.ph',
      department: 'Allied',
      designation: 'Department Head'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/7d68cda9405368d6c315d6e919b6a174',
      name: 'Abegail Malonzo',
      id: '2019000011',
      email: 'abegail.malonzo@bulsu.edu.ph',
      department: 'BSCS',
      designation: 'Faculty'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/c2c23888c99b8b1cfc55e14fc7a72513',
      name: 'Adrian Atenta',
      id: '2019000012',
      email: 'adrian.atenta@bulsu.edu.ph',
      department: 'BSCS',
      designation: 'Faculty'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/826c1e6e8f2cbe368b13809135a7a4d4',
      name: 'Adrian Manalansan',
      id: '2019000013',
      email: 'adrian.manalansan@bulsu.edu.ph',
      department: 'BSCS',
      designation: 'Faculty'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/2c9c9f732b76d7ab7c2e0598a14a61d4',
      name: 'Aimee Nievarez',
      id: '2019000014',
      email: 'aimee.nievarez@bulsu.edu.ph',
      department: 'BSCS',
      designation: 'Faculty'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/1f60e53dce11f26677418dd8e321371a',
      name: 'Alexis Barrozo',
      id: '2019000015',
      email: 'alexis.barrozo@bulsu.edu.ph',
      department: 'BSCS',
      designation: 'Faculty'
    },
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/6c47ad994ab4a3e4f8b670c6a21223a1',
      name: 'Amanda Tolentino',
      id: '2019000016',
      email: 'amanda.tolentino@bulsu.edu.ph',
      department: 'BSIT',
      designation: 'Faculty'
    },
  ];

  rejectedFaculty: any[] = [
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/069280e57d5a8637ea2f1fb4301816da',
      name: 'Aaron Paul Dela Rosa',
      id: '2019XXXXXX',
      email: 'aaronpaul.delarosa@bulsu.edu.ph',
      department: 'BSIT',
      designation: 'Department Head'
    },
  ];

  administrators: any[] = [
    {
      profile_image: 'https://bulsu-cict-app.s3.ap-southeast-1.amazonaws.com/069280e57d5a8637ea2f1fb4301816da',
      name: 'Aaron Paul Dela Rosa',
      id: '2019XXXXXX',
      email: 'aaronpaul.delarosa@bulsu.edu.ph',
      department: 'BSIT',
      designation: 'Department Head'
    },
  ]

  activeTab = 0;
  tabs = [
    { label: 'Verified accounts', badge: this.verifiedFaculty.length },
    { label: 'Deactivated accounts', badge: this.resignedFaculty.length },
    { label: 'Pending accounts', badge: this.pendingFaculty.length },
    { label: 'Rejected accounts', badge: this.rejectedFaculty.length },
    { label: 'Administrators', badge: this.administrators.length },
  ];
  sections = ['faculty-section-verified', 'faculty-section-resigned', 'faculty-section-pending', 'faculty-section-rejected', 'faculty-section-administrators'];

  setActiveTab(index: number) {
    this.activeTab = index;
  }

  filteredVerifiedFaculty: any;
  filteredResignedFaculty: any;
  filteredPendingFaculty: any;
  filteredRejectedFaculty: any;
  filteredAdministrators: any;

  p: number = 1;

  imageUrl = 'http://via.placeholder.com/150'; // Placeholder image URL
  fileToUpload: File | null = null; // Selected file to upload

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      this.imageUrl = URL.createObjectURL(file);
    }
  }


}
