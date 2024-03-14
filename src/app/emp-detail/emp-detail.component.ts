import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService, Employee } from './api.service';

@Component({
  selector: 'app-emp-detail',
  templateUrl: './emp-detail.component.html',
  styleUrls: ['./emp-detail.component.css']
})
export class EmpDetailComponent  implements OnInit{

  Employeeform! : FormGroup;

  constructor ( 
    private fb : FormBuilder,
    private Emp : ApiService
) {}

    

  Employee: Employee[] = [];
  ngOnInit(): void {
     
    this.Emp.getEmployee().subscribe((data) =>{ 
      console.log(data)
      this.Employee = data;
    })
    console.log(this.Employee)


    this.createForm();
    this.Emp.getEmployee().subscribe((data) =>{
    this.Employee = data;
    this.Employeeform.controls['employee_id'].setValue(data[0].employee_id)
    this.Employeeform.controls['empfirst_name'].setValue(data[0].empfirst_name)
    this.Employeeform.controls['emplast_name'].setValue(data[0].emplast_name)
    this.Employeeform.controls['department_id'].setValue(data[0].department_id)
    this.Employeeform.controls['empaddress'].setValue(data[0].empaddress)
    this.Employeeform.controls['empphone_number'].setValue(data[0].empphone_number)
    this.Employeeform.controls['salary'].setValue(data[0].salary)
    this.Employeeform.controls['work_status'].setValue(data[0].work_status)
    this.Employeeform.controls['password'].setValue(data[0].password)
    
    })
    
    
  }
 //test
  createForm() {
    this.Employeeform = this.fb.group({
      employee_id: null,
      empfirst_name: null, 
      emplast_name: null,
      department_id: null,
      empaddress: null,
      empphone_number: null,
      salary: null,
      work_status: null,
      password: null,
    })
  }

}
