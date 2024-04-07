import { Component ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService ,DbTask, TaskDetail} from './api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskDetailComponent implements OnInit{

    dbTaskForm! : FormGroup;
    dbTask : DbTask = {} as DbTask;
    taskDetailDelete: TaskDetail[] = [] as TaskDetail[];
    masterData = {
      customerData:[] = [],
      status: [] = [],
      Employee: [] = [],
      Province: [] = [],
      
    }

    options: any[] = [
      { value: 1, text: 'Option 1' },
      { value: 2, text: 'Option 2' },
      { value: 3, text: 'Option 3' }
    ];
    constructor ( 
      private fb : FormBuilder,
      private se : ApiService,
      private route: ActivatedRoute,
      private router: Router,
    ) {}

    taskNo: string | undefined;
    ngOnInit(): void {
      this.taskNo = this.route.snapshot.paramMap.get('taskNo') || '';
      this.createForm();
      this.rebuildForm();
    }

    rebuildForm(): void{
      this.taskDetailDelete = [];

      if(this.taskNo){

      }else{
        this.dbTask.taskDetail = [];
      }

      this.dbTaskForm.markAsPristine();
    }

    createForm() {
      const dbTaskControls = {
        task_id: null,
        task_no: null,
        vehicle_id: null,
        date: null,
        price: null,
        customer_id: null,
        employee_id: null,
        Detail: null,
        appointment: null,
        Repair_Status1: null,
        Repair_Status2: null,
        Repair_Status3: null,
        all_complete: null,
        status: null,
        province_id: null,
      };
    
      this.dbTaskForm = this.fb.group(dbTaskControls);
    }

    addTaskDetail() {
      const taskDetail: TaskDetail = {
        task_id: null,
        task_detail_id: null,
        seq: this.dbTask.taskDetail.length + 1,
        spare_id: null,
        spare_desc: null,
        detail_qty: null,
        detail_unit_price: null,
        detail_amt: null,
        rowState: 'Add',
      };
      taskDetail.form = this.createTaskDetailForm(taskDetail);
      this.dbTask.taskDetail = this.dbTask.taskDetail.concat(taskDetail);
      console.log("this.dbTask.taskDetail",this.dbTask.taskDetail);
      this.dbTaskForm.markAsDirty();
    }

    createTaskDetailForm(taskDetail: TaskDetail) {
      const fg = this.fb.group({
        task_id: [taskDetail.task_id],
        task_detail_id: [taskDetail.task_detail_id],
        seq: [taskDetail.seq],
        spare_id: [taskDetail.spare_id, [Validators.required]],
        spare_desc: [taskDetail.spare_desc],
        detail_qty: [taskDetail.detail_qty, [Validators.required]],
        detail_unit_price: [taskDetail.detail_unit_price, [Validators.required]],
        detail_amt: [taskDetail.detail_amt],
        rowState: [taskDetail.rowState],
      });

      fg.patchValue(taskDetail, { emitEvent: false });
  
      if (this.dbTaskForm.controls['task_no'].value == 'AUTO') {
        taskDetail.rowState = 'Add';
      }
  
      fg.valueChanges.subscribe((controls) => {
        if (taskDetail.rowState === 'Normal') {
          taskDetail.rowState = 'Edit';
        }
      });
      return fg;
    }

// ------------------------------------------------------------------------------------

 


}
