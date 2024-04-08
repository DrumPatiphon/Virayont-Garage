
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from 'rxjs';
import { UntypedFormGroup } from "@angular/forms";
import { BaseService } from "src/app/shared/base-service/base-service.component"; 

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
    start_work_date : Date;
    appointment_date : Date;
    task_date : Date;
    employee_id : number;
    taskDetail: TaskDetail[],  
}

export interface TaskDetail {
    task_id?: number | null;
    task_detail_id: number | null;
    seq: number | null;
    spare_id: number | null;
    spare_desc: string | null;
    detail_description: string | null;
    detail_qty: number | null;
    detail_unit_price: number | null;
    detail_amt: number | null;
    form?: UntypedFormGroup | undefined;
    rowState: string;
}

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

export interface TaskData 
 {
    seq: number,
    taskNo: string,
    taskDate: string,
    cusName: string,
    taskAmt: number,
    status: string,
  }
@Injectable({
    providedIn: 'root',
})
export class ApiService {
   
private apiUrl = 'https://localhost:7072/api/';

constructor(
    private http: HttpClient,
    private baseService: BaseService,
) {}

    getMasterData(){
        return this.http.get<any>(this.apiUrl + 'task/MasterData');
    }

    findDbTaskByKey(taskId : number) {
        return this.http.get<DbTask>('podt19/detail', { params: { taskId } });
    } 

    save(poIrHead: DbTask, 
        poIrHeadForm: UntypedFormGroup
        ,taskDetailDelete: TaskDetail[]
        ,action: string
        ) {
           const actionObj = {'action' : action};
           const dbTaskFormDTO = Object.assign({}, poIrHead, poIrHeadForm, actionObj);
           dbTaskFormDTO.task_date = new Date(dbTaskFormDTO.task_date);
           dbTaskFormDTO.start_work_date = new Date(dbTaskFormDTO.start_work_date);
           dbTaskFormDTO.appointment_date = new Date(dbTaskFormDTO.appointment_date);
           dbTaskFormDTO.taskDetail = this.baseService.prepareSaveList(dbTaskFormDTO.taskDetail, taskDetailDelete);

       console.log("dbTaskFormDTO :",dbTaskFormDTO);
       if (dbTaskFormDTO.task_id) {
           return this.http.put<any>(this.apiUrl + 'task/Edit', dbTaskFormDTO);
       } else {
           return this.http.post<any>(this.apiUrl + 'task/Create', dbTaskFormDTO);
       }
   }
}

