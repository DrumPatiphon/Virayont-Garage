import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService, PeriodicElement, TaskData } from "./api.service";

// const taskData: TaskData[] = [
//   {"seq":1,"taskNo":"TN20240001","taskDate":"2024-03-16","cusName":"John Doe","taskAmt":1000.50,"status":"SAVED"},
//   {"seq":2,"taskNo":"TN20240002","taskDate":"2024-03-15","cusName":"Jane Smith","taskAmt":750.25,"status":"PENDING"},
//   {"seq":3,"taskNo":"TN20240003","taskDate":"2024-03-14","cusName":"Alice Johnson","taskAmt":1200.75,"status":"COMPLETE"},
//   {"seq":4,"taskNo":"TN20240004","taskDate":"2024-03-13","cusName":"Bob Brown","taskAmt":850.00,"status":"CANCELLED"},
//   {"seq":5,"taskNo":"TN20240005","taskDate":"2024-03-12","cusName":"Emily Davis","taskAmt":950.80,"status":"SAVED"},
//   {"seq":6,"taskNo":"TN20240006","taskDate":"2024-03-11","cusName":"Michael Wilson","taskAmt":1100.30,"status":"PENDING"},
//   {"seq":7,"taskNo":"TN20240007","taskDate":"2024-03-10","cusName":"Olivia Martinez","taskAmt":1300.40,"status":"COMPLETE"},
//   {"seq":8,"taskNo":"TN20240008","taskDate":"2024-03-09","cusName":"William Anderson","taskAmt":800.60,"status":"CANCELLED"},
//   {"seq":9,"taskNo":"TN20240009","taskDate":"2024-03-08","cusName":"Sophia Taylor","taskAmt":950.75,"status":"SAVED"},
//   {"seq":10,"taskNo":"TN20240010","taskDate":"2024-03-07","cusName":"James Thomas","taskAmt":1050.90,"status":"PENDING"},
//   {"seq":11,"taskNo":"TN20240011","taskDate":"2024-03-06","cusName":"Charlotte Clark","taskAmt":1150.10,"status":"COMPLETE"},
//   {"seq":12,"taskNo":"TN20240012","taskDate":"2024-03-05","cusName":"Daniel Rodriguez","taskAmt":870.40,"status":"CANCELLED"},
//   {"seq":13,"taskNo":"TN20240013","taskDate":"2024-03-04","cusName":"Mia Lewis","taskAmt":980.20,"status":"SAVED"},
//   {"seq":14,"taskNo":"TN20240014","taskDate":"2024-03-03","cusName":"Benjamin Walker","taskAmt":1020.70,"status":"PENDING"},
//   {"seq":15,"taskNo":"TN20240015","taskDate":"2024-03-02","cusName":"Amelia Hall","taskAmt":1230.80,"status":"COMPLETE"},
//   {"seq":16,"taskNo":"TN20240016","taskDate":"2024-03-01","cusName":"Ethan Young","taskAmt":890.25,"status":"CANCELLED"},
//   {"seq":17,"taskNo":"TN20240017","taskDate":"2024-02-29","cusName":"Isabella Allen","taskAmt":960.50,"status":"SAVED"},
// ]

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
  })

export class TaskComponent implements OnInit{
  searchForm: UntypedFormGroup;
  taskdata :any[] = [];
  masterData = {
    customerData:[] = [],
    status: [] = [],
    taskNo: [] =[],
  }
  options: any[] = [
    { value: 1, text: 'Option 1' },
    { value: 2, text: 'Option 2' },
    { value: 3, text: 'Option 3' }
  ];
  currentPage = 1;
  itemsPerPage = 10;

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
     ) {
      this.searchForm = this.fb.group({});
    }
      
    ngOnInit(): void {
      this.createForm();
      this.installEvent();
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
        customerId: null, 
        docStatus: null,
        sDocDate: null,
        eDocDate: null,
        sDocNo: null,
        eDocNo: null,
        licenseName: null,
      });
    }

    installEvent(){
      this.searchForm.controls['customerId'].valueChanges.subscribe(value =>{
        console.log(value)
      })
    }

    rebuildForm(){
      this.searchFunction();
    }

    searchFunction() {
      // this.page.index = 0;
      this.search();
    }
  
    search() {
      this.se.findSearchList(this.searchForm.value)
      .subscribe(res => {
        this.taskdata = res;
        this.pagedData = this.taskdata;
        this.pagedData = this.taskdata.slice(0, this.pageSize);
        // const status = (this.poHeads.map(row => row.status));
        // this.rebuildForm();
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
      });
      this.searchFunction();
    }

    addFunction() {
      this.router.navigate(['/task/detail']);
    }

    onPageChange(event: any) {
      const startIndex = event.pageIndex * event.pageSize;
      const endIndex = startIndex + event.pageSize;
      this.pagedData = this.taskdata.slice(startIndex, endIndex);
    }
  
}