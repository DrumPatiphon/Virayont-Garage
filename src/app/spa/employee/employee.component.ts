import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup } from '@angular/forms';
import { EmployeeService, Employee } from './employee.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emp',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent  implements OnInit{

  
  addIcon = faPlus

  searchForm : UntypedFormGroup;
  empData :any[] = [];

  currentPage = 1;
  itemsPerPage = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pagedData: any[] = [];
  dataSource = new MatTableDataSource<any>();
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize: number = 10;

  constructor ( 
    private fb : FormBuilder,
    private router : Router,
    private se : EmployeeService
  ) {this.searchForm = this.fb.group({});}

  ngOnInit(): void {
    this.rebuildForm();
  }
  
  rebuildForm(){
    this.searchFunction();
  }

  searchFunction() {
    this.search();
  }

  search() {
    this.se.findSearchList()
    .subscribe(res => {
      this.empData = res;
      this.pagedData = this.empData;
      this.pagedData = this.empData.slice(0, this.pageSize);
    });
  }

  addFunction() {
    this.router.navigate(['/emp/detail']);
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedData = this.empData.slice(startIndex, endIndex);
  }

}
