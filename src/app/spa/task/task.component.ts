import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService, PeriodicElement, TaskData } from "./api.service";

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];

const taskData: TaskData[] = [
  {"seq":1,"taskNo":"TN20240001","taskDate":"2024-03-16","cusName":"John Doe","taskAmt":1000.50,"status":"SAVED"},
  {"seq":2,"taskNo":"TN20240002","taskDate":"2024-03-15","cusName":"Jane Smith","taskAmt":750.25,"status":"PENDING"},
  {"seq":3,"taskNo":"TN20240003","taskDate":"2024-03-14","cusName":"Alice Johnson","taskAmt":1200.75,"status":"COMPLETE"},
  {"seq":4,"taskNo":"TN20240004","taskDate":"2024-03-13","cusName":"Bob Brown","taskAmt":850.00,"status":"CANCELLED"},
  {"seq":5,"taskNo":"TN20240005","taskDate":"2024-03-12","cusName":"Emily Davis","taskAmt":950.80,"status":"SAVED"},
  {"seq":6,"taskNo":"TN20240006","taskDate":"2024-03-11","cusName":"Michael Wilson","taskAmt":1100.30,"status":"PENDING"},
  {"seq":7,"taskNo":"TN20240007","taskDate":"2024-03-10","cusName":"Olivia Martinez","taskAmt":1300.40,"status":"COMPLETE"},
  {"seq":8,"taskNo":"TN20240008","taskDate":"2024-03-09","cusName":"William Anderson","taskAmt":800.60,"status":"CANCELLED"},
  {"seq":9,"taskNo":"TN20240009","taskDate":"2024-03-08","cusName":"Sophia Taylor","taskAmt":950.75,"status":"SAVED"},
  {"seq":10,"taskNo":"TN20240010","taskDate":"2024-03-07","cusName":"James Thomas","taskAmt":1050.90,"status":"PENDING"},
  {"seq":11,"taskNo":"TN20240011","taskDate":"2024-03-06","cusName":"Charlotte Clark","taskAmt":1150.10,"status":"COMPLETE"},
  {"seq":12,"taskNo":"TN20240012","taskDate":"2024-03-05","cusName":"Daniel Rodriguez","taskAmt":870.40,"status":"CANCELLED"},
  {"seq":13,"taskNo":"TN20240013","taskDate":"2024-03-04","cusName":"Mia Lewis","taskAmt":980.20,"status":"SAVED"},
  {"seq":14,"taskNo":"TN20240014","taskDate":"2024-03-03","cusName":"Benjamin Walker","taskAmt":1020.70,"status":"PENDING"},
  {"seq":15,"taskNo":"TN20240015","taskDate":"2024-03-02","cusName":"Amelia Hall","taskAmt":1230.80,"status":"COMPLETE"},
  {"seq":16,"taskNo":"TN20240016","taskDate":"2024-03-01","cusName":"Ethan Young","taskAmt":890.25,"status":"CANCELLED"},
  {"seq":17,"taskNo":"TN20240017","taskDate":"2024-02-29","cusName":"Isabella Allen","taskAmt":960.50,"status":"SAVED"},
  {"seq":18,"taskNo":"TN20240018","taskDate":"2024-02-28","cusName":"Noah Hernandez","taskAmt":1075.30,"status":"PENDING"},
  {"seq":19,"taskNo":"TN20240019","taskDate":"2024-02-27","cusName":"Ava King","taskAmt":1180.65,"status":"COMPLETE"},
  {"seq":20,"taskNo":"TN20240020","taskDate":"2024-02-26","cusName":"Liam Scott","taskAmt":820.75,"status":"CANCELLED"}
]



@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css']
  })

export class TaskComponent implements OnInit{
  searchForm: UntypedFormGroup;
  taskdata :any[] = taskData;
  displayedColumns: string[] = ['seq', 'taskNo', 'taskDate', 'cusName', 'taskAmt', 'status'];
  masterData = {
    customerData:[] = [],
    status: [] = [],
    
  }
  options: any[] = [
    { value: 1, text: 'Option 1' },
    { value: 2, text: 'Option 2' },
    { value: 3, text: 'Option 3' }
  ];
  currentPage = 1;
  itemsPerPage = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pagedData: any[] = taskData;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize: number = 10;

  // Define other component properties
  dataSource = new MatTableDataSource<TaskData>();
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
      this.pagedData = this.taskdata.slice(0, this.pageSize);
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

    searchFunction() {
      // this.page.index = 0;
      // this.search();
    }
  
    search() {
      // this.po.findpoHead(this.searchForm.value)
      // .subscribe(res => {
      //   this.poHeads = res.rows;
      //   this.page.totalElements = res.count;
      //   const status = (this.poHeads.map(row => row.status));
      //   this.rebuildForm();
      // });
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