import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { CurrentUser } from '../../model/config.model';
import { ConfigDataService } from '../config-data.service';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, ToastrModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ConfigDataService, ToastrModule],
})
export class LoginComponent implements OnInit {
  userName: string = '';
  password: string = '';
  currentUser!: CurrentUser;
  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService,
    private config: ConfigDataService
  ) {}
  ngOnInit(): void {
    localStorage.removeItem('loginTime');
  }
  login(event: Event) {
    event.preventDefault(); // Prevent the default form submission

    const user = {
      userName: this.userName,
      password: this.password,
    };

    this.config.login(user).subscribe(
      (response) => {
        this.currentUser = response;
        this.config.CurrentUser = this.currentUser;
        localStorage.setItem('loginTime', Date.now().toString());
        localStorage.setItem('username', this.currentUser.name);
        this.router.navigate(['/base']);
        this.toast.success('Logged in Succesfully', 'Access Granted ');
      },
      (error) => {
        this.toast.error('Invalid Credentials', 'Access Denied ');
      }
    );

  }
}
