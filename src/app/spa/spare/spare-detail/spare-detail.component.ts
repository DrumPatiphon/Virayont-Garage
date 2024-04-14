import { Component } from '@angular/core';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-spare-detail',
  templateUrl: './spare-detail.component.html',
  styleUrls: ['./spare-detail.component.css']
})
export class SpareDetailComponent {
  save = faSave
  cancel = faXmark
}

