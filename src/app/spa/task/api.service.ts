
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from 'rxjs';
import { UntypedFormGroup } from "@angular/forms";

// export interface Spare4Task {

//     detail_id: Number,
//     task_id: Number,
//     spare_id: Number,    
// }

export interface DbTask {

    task_id: Number,
    vehicle_id: Number,
    date: Date,    
    price: Number,
    employee_id: Number,    
    Detail: string,
    appointment: Date,
    Repair_Status1: Boolean,    
    Repair_Status2: Boolean,
    Repair_Status3: Boolean,
    all_complete: Boolean,
    taskDetail: TaskDetail[],  
}

export interface TaskDetail {
    task_id: number | null;
    task_detail_id: number | null;
    seq: number | null;
    spare_id: number | null;
    spare_desc: string | null;
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

constructor(private http: HttpClient) {}

    getMasterData(){
        return this.http.get<any>(this.apiUrl + 'task/MasterData');
    }

    // getSparetask():Observable<Spare4Task[]> {
    // return this.http.get<Spare4Task[]>(this.apiUrl + 'Spare4Task');
    // }

    // getDbtask():Observable<Dbtask []> {
    // return this.http.get<Dbtask[]>(this.apiUrl + 'Dbtask ');
    // }

    
    




}

