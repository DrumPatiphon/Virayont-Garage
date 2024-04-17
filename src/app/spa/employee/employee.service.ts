
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from 'rxjs';
import { BaseService } from "src/app/shared/base-service/base-service.component"; 
import { Constants } from "src/app/shared/constants/constants";
import { UntypedFormGroup } from "@angular/forms";

export interface Employee {
    employee_id: Number,
    empfirst_name: String, 
    emplast_name: string,
    department_id: Number,
    empaddress: String,
    empphone_number: String,
    salary: Boolean,
    work_status: String,
    password: String,
}

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
   
    private apiUrl = Constants.ApiRoute.Route;
    constructor(
        private http: HttpClient,
        private baseService: BaseService,
    ) {}


    getMasterData(){
        return this.http.get<any>(this.apiUrl + 'emp/EmpMaster');
    }

    findSearchList(){
        const filter: { [key: string]: any } = {};
        return this.http.get<any[]>(this.apiUrl + 'emp/EmpList', { params: filter });
    }

    findEmpByKey(employeeId : number) {
        return this.http.get<any>(`${this.apiUrl}emp/EmpDetail/${employeeId}`);
    } 

    save(employee: Employee, 
        employeeForm: UntypedFormGroup
        ,action: string
        ) {
           const actionObj = {'action' : action};
           const dbTaskFormDTO = Object.assign({}, employee, employeeForm, actionObj);
       if (dbTaskFormDTO.employee_id) {
           return this.http.put<any>(this.apiUrl + 'emp/EditEmp', dbTaskFormDTO);
       } else {
           return this.http.post<any>(this.apiUrl + 'emp/CreateEmp', dbTaskFormDTO);
       }
   }
}

