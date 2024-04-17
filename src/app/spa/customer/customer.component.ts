import { Component ,OnInit, ViewChild} from '@angular/core';
import { CustomerService, Customer } from './customer.service';
import { FormBuilder , FormGroup ,UntypedFormGroup,Validators} from '@angular/forms';
import { faBarsStaggered, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit{
  deleteall = faBarsStaggered
  searchIcon = faSearch
  add = faPlus

  searchForm : UntypedFormGroup;
  customerData :any[] = [];
  masterData = {
    customerData:[] = [],
  }

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
    private se : CustomerService
  ) {this.searchForm = this.fb.group({});}


  ngOnInit(): void {
    this.createForm();
    this.se.getMasterData().subscribe({
      next: (response: any) => {
        this.masterData = response;
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
    this.rebuildForm();
  }

  createForm() {
    this.searchForm = this.fb.group({
      address: null,
      companyName: null, 
      customerId: null,
      firstName: null,
      lastName: null,
      phoneNumber: null,
    })
  }

  rebuildForm(){
    this.searchFunction();
  }

  searchFunction() {
    this.search();
  }

  search() {
    this.se.findSearchList(this.searchForm.value)
    .subscribe(res => {
      this.customerData = res;
      this.pagedData = this.customerData;
      this.pagedData = this.customerData.slice(0, this.pageSize);
    });
  }

  clear(){
    this.searchForm.patchValue({
      address: null,
      companyName: null, 
      customerId: null,
      firstName: null,
      lastName: null,
      phoneNumber: null,
    });
    this.searchFunction();
  }

  addFunction() {
    this.router.navigate(['/customer/detail']);
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedData = this.customerData.slice(startIndex, endIndex);
  }


}
