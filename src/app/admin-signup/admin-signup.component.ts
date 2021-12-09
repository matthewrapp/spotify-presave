import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Admin } from '../models/admin.model';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'sp-admin-signup',
  templateUrl: './admin-signup.component.html',
  styleUrls: ['./admin-signup.component.css']
})
export class AdminSignupComponent implements OnInit {
  errors: boolean = false;
  errorMsg: string = '';
  signupForm!: FormGroup;


  constructor(private adminService: AdminService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  createUser() {
    const email = this.signupForm.value.email;
    const fn = this.signupForm.value.firstName;
    const ln = this.signupForm.value.lastName;
    const pw = this.signupForm.value.password;
    const artistName = this.signupForm.value.artistName;

    const newAdmin = new Admin(email, fn, ln, pw, artistName);
    this.adminService.writeAdmin(newAdmin);
    this.adminService.createAdminResEvent.subscribe(result => {
      // if result contains an error, show the error on the client side
      if (result.status !== 200) {
        this.errors = true;
        this.errorMsg = result.res.error.message;
        return
      }
      // if not, redirect to login
      this.errors = false;
      this.errorMsg = '';
      this.router.navigate(['/login'])
    })
  }
  private initForm() {
    this.signupForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'firstName': new FormControl('', Validators.required),
      'lastName': new FormControl('', Validators.required),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'artistName': new FormControl('', Validators.min(1)),
    });
  }

}
