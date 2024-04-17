import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { faSave,faTrash } from '@fortawesome/free-solid-svg-icons';
import { Employee, EmployeeService } from './employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-emp-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeDetailComponent implements OnInit{
  saveIcon = faSave
  deleteIcon = faTrash

  empForm! : FormGroup;
  employee : Employee = {} as Employee;
  empId: number | null = null;
  masterData = {
    positionData:[] = [],
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
    private se : EmployeeService,
  ) {}

  ngOnInit(): void {
    const empIdParam = this.route.snapshot.paramMap.get('empId');
    this.empId = empIdParam ? +empIdParam : null;
    this.se.getMasterData().subscribe({
      next: (response: any) => {
        this.masterData = response;
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
    this.createForm();
    this.rebuildForm();
    this.installEvent();
  }

  createForm() {
    this.empForm = this.fb.group({
      employee_id: null,
      employee_str_id: "AUTO",
      empfirst_name: null, 
      emplast_name: null,
      department_id: null,
      empaddress: null,
      empphone_number: null,
      salary: null,
      work_status: null,
      password: null,
    });
  }

  rebuildForm(): void{
    console.log("empId :",this.empId)
    if(this.empId){
      const controls = this.empForm.controls
      if(this.employee){
        this.se.findEmpByKey(this.empId).subscribe(res => {
          this.employee = res
          this.empForm.patchValue(this.employee, { emitEvent: false });
          this.empForm.controls['employee_str_id'].setValue(this.employee.employee_id?.toString());
        });
      }
    }else{

    }
    this.empForm.markAsPristine();
  }

      
  installEvent(){

  }

  save(action: string) { 
    this.se.save(this.employee,
                 this.empForm.getRawValue(),
                 action,
      )
      .pipe(
      switchMap(result => this.se.findEmpByKey(result))
    ).subscribe((result: any) => {
      this.employee = result;
      this.empId = result.employee_id;
      this.rebuildForm();
    });
  }

  delete(action: string){
    this.se.save(this.employee,
                 this.empForm.getRawValue(),
                 action,
    ).subscribe(res => {
      if(res){
        this.router.navigate(['/emp']);
      }
    })

  }
}
