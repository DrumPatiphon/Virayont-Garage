import { Component, Input, Output, EventEmitter, NgModule  } from '@angular/core';
import { FormGroup } from '@angular/forms';

interface SelectObj {
  value: any;
  text: string;
}

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.css']
})
export class SelectInputComponent {
  @Input() options!: SelectObj[];
  @Input() formControlName!: string;

  @Output() valueChange = new EventEmitter<any>();

  selectedValue: any = null;

  onSelectChange(newValue: any) {
    this.selectedValue = newValue;
    this.valueChange.emit(newValue);
  }
}
