
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from 'rxjs';
import { UntypedFormGroup } from "@angular/forms";
import { BaseService } from "src/app/shared/base-service/base-service.component"; 
import { Constants } from "src/app/shared/constants/constants";
import { User } from "src/app/login/login.service";

export interface DbTask {
    task_id : number;
    task_no : string;
    license_desc : string;
    province_id : number;
    customer_id : number;
    customer_address : string;
    customer_phone : string;
    task_amt : Number
    remark : string;
    status : string;
    start_work_date? : Date;
    appointment_date? : Date;
    task_date? : Date;
    employee_id : number;
    create_date? : Date;
    // update_date? : Date;
    // create_by? : number;
    taskDetail: TaskDetail[],  
}

export interface TaskDetail {
    task_id?: number | null;
    detail_id?: number | null;
    seq: number | null;
    spare_id: number | null;
    spare_desc?: string | null;
    detail_description?: string | null;
    detail_qty: number | null;
    detail_unit_price: number | null;
    detail_amt: number | null;
    form?: UntypedFormGroup | undefined;
    rowState: string;
}

export interface Status{
    value : string
    text : string
    isAdmin : boolean
}

export interface UserData extends User{

}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
   
    private apiUrl = Constants.ApiRoute.Route;
    constructor(
        private http: HttpClient,
        private baseService: BaseService,
    ) {}

    getMasterData(){
        return this.http.get<any>(this.apiUrl + 'task/MasterData');
    }

    findSearchList(search : any){
        const filter: { [key: string]: any } = {};
        for (const key in search) {
          if (search.hasOwnProperty(key) && search[key] !== null) {
            filter[key] = search[key];
          }
        }
        return this.http.get<any[]>(this.apiUrl + 'task/List', { params: filter });
    }

    findDbTaskByKey(taskId : number) {
        // return this.http.get<DbTask>(`${this.apiUrl}task/Detail`, { params: { taskId: taskId.toString() } });
        return this.http.get<any>(`${this.apiUrl}task/Detail/${taskId}`);
    } 

    save(dbTask: DbTask, 
        dbTaskForm: UntypedFormGroup
        ,taskDetailDelete: TaskDetail[]
        ,action: string
        ) {
           const actionObj = {'action' : action};
           const dbTaskFormDTO = Object.assign({}, dbTask, dbTaskForm, actionObj);
           dbTaskFormDTO.task_date =  dbTaskFormDTO.task_date == null ? undefined : new Date(dbTaskFormDTO.task_date);
           dbTaskFormDTO.start_work_date = dbTaskFormDTO.start_work_date == null ? undefined :  new Date(dbTaskFormDTO.start_work_date);
           dbTaskFormDTO.appointment_date = dbTaskFormDTO.appointment_date == null ? undefined :  new Date(dbTaskFormDTO.appointment_date);
           dbTaskFormDTO.taskDetail = this.baseService.prepareSaveList(dbTaskFormDTO.taskDetail, taskDetailDelete);

       console.log("dbTaskFormDTO :",dbTaskFormDTO);
       if (dbTaskFormDTO.task_id) {
           return this.http.put<any>(this.apiUrl + 'task/Edit', dbTaskFormDTO);
       } else {
           return this.http.post<any>(this.apiUrl + 'task/Create', dbTaskFormDTO);
       }
   }
}

