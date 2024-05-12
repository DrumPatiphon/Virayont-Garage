import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/login/login.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  user: User = {} as User;

  constructor ( 
    private router: Router,
    private authService: AuthService
 ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if(!this.user){
      this.router.navigate(['/login']);
    }
  }

  isCustomer():boolean{
    let result = false;
    if(this.user.userRole == 'customer'){
      result = true;
    }
    return result;
  }

  isAdmin():boolean{
    let result = false;
    if(this.user.userRole == 'Admin'){
      result = true;
    }
    return result;
  }

  isEmployee():boolean{
    let result = false;
    if(!(this.user.userRole == 'Admin'|| this.user.userRole == 'customer')){
      result = true;
    }
    return result;
  }
}
