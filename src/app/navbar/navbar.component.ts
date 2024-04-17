import { Component } from '@angular/core';
import { faWrench,faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  faWrench = faWrench
  login = faArrowRightToBracket
}
