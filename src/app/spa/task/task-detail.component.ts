import { Component ,OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService ,DbTask, TaskDetail} from './api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { finalize, switchMap } from 'rxjs';

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
      customerData: [] = [],
      status: [] = [],
      employee: [] = [],
      province: [] = [],
      spareData: []= [],
    }
    currentDate:Date = new Date();
    formattedDate?:string;

    // @ViewChild(MatPaginator) paginator!: MatPaginator;
    // pagedData: any[] = [];
    // pageSizeOptions: number[] = [5, 10, 25, 100];
    // pageSize: number = 5;

    constructor ( 
      private fb : FormBuilder,
      private se : ApiService,
      private route: ActivatedRoute,
      private router: Router,
    ) {}

    taskNo: string | undefined;
    ngOnInit(): void {
      this.taskNo = this.route.snapshot.paramMap.get('taskNo') || '';
      this.se.getMasterData().subscribe({
        next: (response: any) => {
          this.masterData = response;
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
      });
      this.formattedDate = this.currentDate.getDate() + '/' + (this.currentDate.getMonth() + 1) + '/' + this.currentDate.getFullYear();
      this.createForm();
      this.rebuildForm();
      this.installEvent();
    }

    rebuildForm(): void{
      this.taskDetailDelete = [];

      if(this.taskNo){

      }else{
        this.dbTask.taskDetail = [];
        if(this.masterData.status.length > 0){
          const createStatus = (this.masterData.status as any[]).filter(row => row.id == 1);
          this.dbTaskForm.controls['status'].setValue(createStatus[0].value)
        }
      }

      this.dbTaskForm.controls['task_amt'].disable();
      this.dbTaskForm.markAsPristine();
    }

    installEvent(){
      this.dbTaskForm.controls['customer_id'].valueChanges.subscribe(selectedValue => {
        const controls = this.dbTaskForm.controls
        if(this.dbTaskForm.controls['customer_id'].dirty && selectedValue){
          const selectedRow = (this.masterData.customerData as any[]).filter(row => row.value == selectedValue);
          controls['customer_name'].setValue(selectedRow[0].firstName);
          controls['customer_lastname'].setValue(selectedRow[0].lastName);
          controls['customer_phone'].setValue(selectedRow[0].phoneNumber);
          controls['customer_company'].setValue(selectedRow[0].companyName);
          controls['customer_address'].setValue(selectedRow[0].address);
        }else{
          controls['customer_name'].setValue(null);
          controls['customer_lastname'].setValue(null);
          controls['customer_phone'].setValue(null);
          controls['customer_company'].setValue(null);
          controls['customer_address'].setValue(null);
        }
      });
    }

    createForm() {
      const dbTaskControls = {
        task_id: null,
        task_no: "AUTO",
        task_date: this.formattedDate,
        task_amt: 0.00,
        customer_id: null,
        customer_name: null,
        customer_lastname: null,
        customer_phone: null,
        customer_company: null,
        customer_address: null,
        employee_id: null,
        remark: null,
        status: null,
        province_id: null,
        start_work_date: this.formattedDate,
        appointment_date: null,
      };
    
      this.dbTaskForm = this.fb.group(dbTaskControls);
    }

    addTaskDetail() {
      const taskDetail: TaskDetail = {
        task_id: 0,
        task_detail_id: 0,
        seq: this.dbTask.taskDetail.length + 1,
        spare_id: null,
        spare_desc: null,
        detail_description: null,
        detail_qty: 0.00,
        detail_unit_price: 0.00,
        detail_amt: 0.00,
        rowState: 'Add',
      };
      taskDetail.form = this.createTaskDetailForm(taskDetail);
      this.dbTask.taskDetail = this.dbTask.taskDetail.concat(taskDetail);
      // this.pagedData = this.dbTask.taskDetail;
      this.dbTaskForm.markAsDirty();
    }

    createTaskDetailForm(taskDetail: TaskDetail) {
      const fg = this.fb.group({
        task_id: [taskDetail.task_id],
        task_detail_id: [taskDetail.task_detail_id],
        seq: [taskDetail.seq],
        spare_id: [taskDetail.spare_id, [Validators.required]],
        spare_desc: [taskDetail.spare_desc],
        detail_description: [taskDetail.detail_description],
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

      fg.controls.spare_id.valueChanges.subscribe(selectedValue => {
        if(fg.controls.spare_id.dirty && selectedValue){
          const selectedRow = (this.masterData.spareData as any[]).filter(row => row.value == selectedValue);
          fg.controls.spare_desc.setValue(selectedRow[0].spareName);
          fg.controls.detail_unit_price.setValue(selectedRow[0].sparePrice);
        }else{
          fg.controls.spare_desc.setValue(null);
          fg.controls.detail_unit_price.setValue(null);
        }
      });

      fg.controls.detail_qty.valueChanges.subscribe(value => {
        if(fg.controls.detail_qty.dirty && value){
          const unitPrice = fg.controls.detail_unit_price.value || 0;
          fg.controls.detail_amt.setValue((value * unitPrice) || 0);
          this.calTaskAmt();
        }else{
          fg.controls.detail_amt.setValue(0);
          this.calTaskAmt();
        }
      });

      fg.controls.detail_unit_price.valueChanges.subscribe(value => {
        if(fg.controls.detail_unit_price.dirty && value){
          const detailQty = fg.controls.detail_qty.value || 0;
          fg.controls.detail_amt.setValue((value * detailQty) || 0);
          this.calTaskAmt();
        }else{
          fg.controls.detail_amt.setValue(0);
          this.calTaskAmt();
        }
      });
      return fg;
    }

    removeTaskDetail(detail: TaskDetail, rowIndex: number) {
      let taskDetail = this.dbTask.taskDetail;
    
      if (this.dbTask && this.dbTask.taskDetail) {
        taskDetail.splice(rowIndex, 1);
      
        this.dbTask.taskDetail.forEach((item, index) => {
          item.seq = index + 1;
          if (item.form && item.form.controls['seq']) {
            item.form.controls['seq'].setValue(item.seq);
          }
        });
      }
    
      this.dbTaskForm.markAsDirty();
    
      if (detail.rowState !== 'Add') {
        detail.rowState = 'Delete';
        this.taskDetailDelete.push(detail);
      }
      this.calTaskAmt();
    }

    calTaskAmt(){
      const sumtaskdetail = this.dbTask.taskDetail
      .reduce((total, num) => (total + num.form?.controls['detail_amt'].value || 0), 0);

      this.dbTaskForm.controls['task_amt'].setValue(sumtaskdetail || 0);
    }

    save(action: string) {
      if(action == 'Cancel'){
        // this.onSetDetailRowState();
      }
        // const forms: UntypedFormGroup[] = [this.poIrHeadForm].concat(this.poIrHead.poIrDet.map(detail => detail.form));
        // if (this.util.isFormGroupsValid(forms) && this.isDetailValid(action) && this.isAttachValid()) { 
          this.se.save(this.dbTask,
                       this.dbTaskForm.getRawValue(),
                       this.taskDetailDelete,
                       action,
            )
            .pipe(
            switchMap(result => this.se.findDbTaskByKey(result.task_id))
          ).subscribe((result: any) => {
            this.dbTask = result;
            this.rebuildForm();
          });
      // }
    }

    onSetDetailRowState(){
      this.dbTask.taskDetail.forEach(res => {
        if (res.rowState === 'Normal') {
          res.rowState = "Edit";
        }
      });
    }
    

    // onPageChange(event: any) {
    //   const startIndex = event.pageIndex * event.pageSize;
    //   const endIndex = startIndex + event.pageSize;
    //   this.pagedData = this.dbTask.taskDetail.slice(startIndex, endIndex);
    // }

// ------------------------------------------------------------------------------------

 


}
