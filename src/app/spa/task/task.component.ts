import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService, UserData} from "./api.service";
import { DatePipe } from '@angular/common';
import { faBarsStaggered, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from "src/app/auth/auth.service";
import { User } from "src/app/login/login.service";
import { buffer } from "rxjs";

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
  })

export class TaskComponent implements OnInit{
  deleteall = faBarsStaggered
  searchicon = faSearch
  add = faPlus   

  searchForm: UntypedFormGroup;
  taskdata :any[] = [];
  masterData = {
    customerData:[] = [],
    status: [] = [],
    taskNo: [] = [],
    employee: [] = [],
  }
  currentPage = 1;
  itemsPerPage = 10;
  user: UserData = {} as UserData;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pagedData: any[] = [];
  dataSource = new MatTableDataSource<any>();
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize: number = 10;
  
    constructor ( 
        private fb : UntypedFormBuilder,
        private route: ActivatedRoute,
        private router : Router,
        private se : ApiService,
        private datePipe: DatePipe,
        private authService: AuthService
     ) {
      this.searchForm = this.fb.group({});
    }
      
    ngOnInit(): void {
      this.user = this.authService.getCurrentUser();
      if(!this.user){
        this.router.navigate(['/login']);
      }
      this.createForm();
      this.installEvent();
      this.se.getMasterData().subscribe({
        next: (response: any) => {
          this.masterData = response;
          if(this.user.userRole == 'customer'){
            this.masterData.taskNo = (this.masterData.taskNo as any[]).filter(row => row.customerPhone == (this.user.taskPhone || this.user.phoneNumber)) as [];
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
      });
      this.rebuildForm();
    }

    createForm() {
      this.searchForm = this.fb.group({
        customerId: { value: null, disabled: this.isCustomer()}, 
        docStatus: null,
        sDocDate: null,
        eDocDate: null,
        sDocNo: { value: null, disabled: (this.isCustomer() && this.isNotRegistered()) },
        eDocNo: { value: null, disabled: (this.isCustomer() && this.isNotRegistered())},
        phoneNo: [{ value: null, disabled:  this.isCustomer()}],
        empId: [{ value: null, disabled:  this.isCustomer()}],
        licenseName: null,
      });
    }

    installEvent(){

    }

    rebuildForm(){
      if(this.user){
        this.setDataCustomer(this.user)
        this.searchFunction();
      }
    }

    searchFunction() {
      this.search();
    }
  
    search() {
      const param = this.searchForm.getRawValue();
      this.se.findSearchList(param)
      .subscribe(res => {
        this.taskdata = res;
        this.pagedData = this.taskdata;
        this.pagedData = this.taskdata.slice(0, this.pageSize);
      });
    }

    clear(){
      this.searchForm.patchValue({
        customerId: null, 
        docStatus: null,
        sDocDate: null,
        eDocDate: null,
        sDocNo: null,
        eDocno: null,
        licenseName: null,
        empId: null,
      });
      this.searchFunction();
    }

    addFunction() {
      this.router.navigate(['/task/detail']);
    }

    setDataCustomer(userData :UserData){
      if(userData.userRole == 'customer'){
        this.searchForm.controls['customerId'].setValue(userData.userId);
        // const phoneNo = userData.taskPhone == null? : userData.phoneNumber
        this.searchForm.controls['phoneNo'].setValue(userData.taskPhone || userData.phoneNumber);
      }
    }

    isCustomer():boolean{
      return this.user.userRole === 'customer';
    }

    isNotRegistered():boolean{
      return this.user.userId === null;
    }

    onPageChange(event: any) {
      const startIndex = event.pageIndex * event.pageSize;
      const endIndex = startIndex + event.pageSize;
      this.pagedData = this.taskdata.slice(startIndex, endIndex);
    }
  
}