import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService} from "./api.service";
import { DatePipe } from '@angular/common';
import { faBarsStaggered, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

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
    taskNo: [] =[],
  }
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
        private datePipe: DatePipe,
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