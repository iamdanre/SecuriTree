import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { DoorService } from '../_services/door.service'

interface Door {
  _id: string;
  name: string;
  parentArea_id: string;
  status: string;
}

@Component({
  selector: 'app-manage-doors',
  templateUrl: './manage-doors.component.html',
  styleUrls: ['./manage-doors.component.scss']
})
export class ManageDoorsComponent implements OnInit {
  doors?: [Door];
  panelOpenState = true;
  isLoggedIn = false;
  constructor(private doorService: DoorService, private tokenStorageService: TokenStorageService) {
    this.doorService.getAll().subscribe((data) => {
      this.doors = data
    });
  }

  ngOnInit(): void {
    // to prevent unauthorized access
    this.isLoggedIn = !!this.tokenStorageService.getToken();
  }

  unlock(id: string): void {
    this.doorService.unlock(id).then(() => {
      window.location.reload();
      window.alert("Door Unlocked.\nRefreshing...");
    });
  }
  lock(id: string): void {
    this.doorService.lock(id).then(() => {
      window.location.reload();
      window.alert("Door Locked.\nRefreshing...");
    });
  }
}
