import { Component, OnInit } from '@angular/core';
import { faWrench,faArrowRightToBracket,faDoorOpen,faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  faWrench = faWrench
  login = faArrowRightToBracket
  logOutIcon = faDoorOpen
  menuIcon = faBars
  user:any = null;

  constructor ( 
    private router : Router,
    private authService: AuthService
 ) {}

  ngOnInit(): void {
    this.authService.userChanged.subscribe((userData) => {
      this.user = userData;
    });
  }

  logOut(){
    this.user = null
    this.router.navigate(['/login']);
  }
}
