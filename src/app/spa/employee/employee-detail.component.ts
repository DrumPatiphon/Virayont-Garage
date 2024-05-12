import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { faSave,faTrash } from '@fortawesome/free-solid-svg-icons';
import { Employee, EmployeeService } from './employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { UserData } from '../task/api.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/shared/Validators/custom.validators';

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
  user: UserData = {} as UserData;

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
    private authService: AuthService,
    private ms: ToastrService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if(!this.user || this.user.userRole == 'customer'){
      this.router.navigate(['/login']);
    }
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
      employee_str_id: [{value : "AUTO", disabled: true}],
      empfirst_name: [null,[Validators.required]], 
      emplast_name: [null,[Validators.required]],
      department_id: [null,[Validators.required]],
      empaddress: null,
      empphone_number: [null,[Validators.required, CustomValidators.phoneNo()]],
      salary: [null,[CustomValidators.numberOnly()]],
      work_status: null,
      password: null,
    });
  }

  rebuildForm(): void{
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
    if(this.isFormValid(this.empForm)){
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
      this.ms.success('บันทึกสำเร็จ');
    }
  }


 
  delete(action: string){
    this.se.save(this.employee,
                 this.empForm.getRawValue(),
                 action,
    ).subscribe(res => {
      if(res){
        this.ms.success('ลบข้อมูลสำเร็จ');
        this.router.navigate(['/emp']);
      }
    })
  }

  IsAuto():boolean{
    let disable = false;
    if(this.empForm.controls['employee_str_id'].value == 'AUTO'){
      disable = true;
    }
    return disable;
  }

  isFormValid(formGroup: FormGroup): boolean {
    let isValid = true;

    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        if (!this.isFormValid(control)) {
          isValid = false;
        }
      } else {
        control.markAsTouched();
        if (control.invalid) {
          isValid = false;
        }
      }
    });

    if(!isValid){
      this.ms.error('กรุณาตรวจสอบข้อมูลให้ถูกต้อง');
    }

    return isValid;
  }

  isInvalid(controlName: string){
    const control = this.empForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }
}
