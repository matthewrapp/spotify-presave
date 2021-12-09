import { Component, OnInit } from '@angular/core';
import { Song } from '../models/song.model';
import { AuthService } from '../services/auth.service';
import { SongService } from '../services/song.service';

@Component({
  selector: 'sp-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private authService: AuthService, private songService: SongService) { }

  ngOnInit(): void {
    
  }

}
