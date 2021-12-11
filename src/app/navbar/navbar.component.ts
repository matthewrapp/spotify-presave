import { Component, OnInit } from '@angular/core';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'sp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class SidebarComponent implements OnInit {
  // icons
  faSignIn = faArrowAltCircleRight;
  brandName: string = 'Spotify Presave';
  sidebarStatus: boolean = false;
  navCollapsed: boolean = true;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
  }

  changeSidebarStatus(){
    this.sidebarStatus = !this.sidebarStatus;       
  }

  toggleNav() {
    this.navCollapsed = !this.navCollapsed;
  }

  logoutUser() {
    this.adminService.logoutAdmin();
  }

}
