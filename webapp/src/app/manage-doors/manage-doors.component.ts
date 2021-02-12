import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-manage-doors',
  templateUrl: './manage-doors.component.html',
  styleUrls: ['./manage-doors.component.scss']
})
export class ManageDoorsComponent implements OnInit {
  isLoggedIn = false;
  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    // to prevent unauthorized access
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }

}
