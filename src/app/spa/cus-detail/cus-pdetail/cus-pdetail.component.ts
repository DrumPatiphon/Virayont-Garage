import { Component } from '@angular/core';
import { faSave,faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cus-pdetail',
  templateUrl: './cus-pdetail.component.html',
  styleUrls: ['./cus-pdetail.component.css']
})
export class CusPdetailComponent {
  saveIcon = faSave
  cancelIcon = faXmark
}
