import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sp-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  brandName: string = 'Spotify Presave';
  sidebarStatus: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  changeSidebarStatus(){
    this.sidebarStatus = !this.sidebarStatus;       
  }

}
