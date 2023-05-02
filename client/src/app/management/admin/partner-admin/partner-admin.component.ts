import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-partner-admin',
  templateUrl: './partner-admin.component.html',
  styleUrls: ['./partner-admin.component.css']
})

export class PartnerAdminComponent implements OnInit {
  partnerId: string | null | undefined;

  constructor(private route: ActivatedRoute) {
    this.partnerId = undefined;
  }
  
  ngOnInit(): void {
    this.partnerId = this.route.snapshot.paramMap.get('id');
  }

  
}
