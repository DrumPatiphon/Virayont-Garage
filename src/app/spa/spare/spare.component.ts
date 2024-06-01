import { Component, OnInit, ViewChild} from '@angular/core';
import { SparePartService, Sparepart } from './spare.service';
import { UntypedFormBuilder, UntypedFormGroup, Validator, Validators } from '@angular/forms';
import { faBarsStaggered,faSearch,faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spare',
  templateUrl: './spare.component.html',
  styleUrls: ['./spare.component.css']
})
export class SpareComponent implements OnInit {
  deleteall = faBarsStaggered
  searchIcon = faSearch
  add = faPlus

  searchForm : UntypedFormGroup;
  spareData :any[] = [];
  masterData = {
    spareData:[] = [],
    spareType:[] = [],
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
    private router : Router,
    private se : SparePartService,
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
      spareId: null,
      spareName: null,
      sparePrice: null,
      quantity: null,
      spareTypeId: null,
      spareBal: null,
    });
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
      this.spareData = res;
      this.pagedData = this.spareData;
      this.pagedData = this.spareData.slice(0, this.pageSize);
    });
  }

  clear(){
    this.searchForm.patchValue({
      spareId: null,
      spareName: null,
      sparePrice: null,
      quantity: null,
      spareTypeId: null,
    });
    this.searchFunction();
  }

  addFunction() {
    this.router.navigate(['/spare/detail']);
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedData = this.spareData.slice(startIndex, endIndex);
  }

  
}
