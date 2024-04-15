import { Component } from '@angular/core';
import { faSave,faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-emp-pdetail',
  templateUrl: './emp-pdetail.component.html',
  styleUrls: ['./emp-pdetail.component.css']
})
export class EmpPdetailComponent {
  saveIcon = faSave
  cancelIcon = faXmark
}
