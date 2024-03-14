import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-column',
  template: '',
  styleUrls: []
})
export class AppTableColumnComponent implements OnInit {
  @Input() name!: string;
  @Input() width?: number;
  @Input() cellClass: string = '';

  constructor() { }

  ngOnInit(): void {
  }
}