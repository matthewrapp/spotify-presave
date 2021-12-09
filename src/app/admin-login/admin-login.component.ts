import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'sp-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  errors: boolean = false;
  errorMsg: string = '';
  loginForm!: FormGroup;

  constructor(private adminService: AdminService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  loginUser() {
    const email = this.loginForm.value.email;
    const pw = this.loginForm.value.password;

    this.adminService.loginAdmin(email, pw);
    this.adminService.loginAdminResEvent.subscribe(result => {
      if (result.status !== 200) {
        this.errors = true;
        this.errorMsg = result.res.error.message;
        return
      }

      // if not, sign them in
      this.errors = false;
      this.errorMsg = '';
      this.router.navigate(['/admin/dashboard']);
    })
  }

  private initForm() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required)
    })
  }

}
