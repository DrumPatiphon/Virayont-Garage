import { Component ,OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService ,DbTask, TaskDetail, UserData, Status, Spare} from './api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { faSave,faPlus,faXmark } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomValidators } from 'src/app/shared/Validators/custom.validators';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-task',
  templateUrl: './task-detail.component.html',
  styleUrls: [ './task.component.css']
})
export class TaskDetailComponent implements OnInit{

  saveIcon = faSave
  cancelIcon = faXmark
  addIcon = faPlus

    dbTaskForm! : FormGroup;  
    dbTask : DbTask = {} as DbTask; 
    taskDetailDelete: TaskDetail[] = [] as TaskDetail[]; 
    user: UserData = {} as UserData; 
    masterData = {  
      customerData: [] = [], 
      status: [] = [] as Status[],
      employee: [] = [],
      province: [] = [],
      spareData: []= [] as Spare[],
    }
    currentDate:Date = new Date();
    formattedDate?:string;
    previousDetailQty:number = 0;

    constructor ( 
      private fb : FormBuilder,
      private se : ApiService,
      private route: ActivatedRoute,
      private router: Router,
      private datePipe: DatePipe,
      private authService: AuthService,
      private ms: ToastrService,
    ) {}

    taskId: number | null = null;  

    ngOnInit(): void {
      this.user = this.authService.getCurrentUser();
      if(!this.user){
        this.router.navigate(['/login']);
      }

      const taskIdParam = this.route.snapshot.paramMap.get('taskId');  
      this.taskId = taskIdParam ? +taskIdParam : null;  
      
      this.se.getMasterData().subscribe({
        next: (response: any) => {
          this.masterData = response;
          if (this.user.userRole !== "Admin") {
            this.masterData.status = (this.masterData.status as any[]).filter(row => !row.isAdmin);
          }
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
      });
      this.formattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')?.toString();
      this.createForm();
      this.rebuildForm();
      this.installEvent();
    }

    rebuildForm(): void{
      this.taskDetailDelete = []; 

      if(this.taskId){
        const controls = this.dbTaskForm.controls
        if(this.dbTask){
          this.se.findDbTaskByKey(this.taskId).subscribe(res => {  
            this.dbTask = res.dbTask;
            this.dbTask.taskDetail = res.taskDetail;
            this.dbTaskForm.patchValue(this.dbTask, { emitEvent: false });
            this.dbTask.taskDetail.forEach(value => {value.form = this.createTaskDetailForm(value);  value.rowState = 'Normal';});
            const taskDate = this.datePipe.transform(this.dbTask.task_date, 'yyyy-MM-dd')?.toString();
            const startWorkDate = this.datePipe.transform(this.dbTask.start_work_date, 'yyyy-MM-dd')?.toString();
            const appointmentDate = this.datePipe.transform(this.dbTask.appointment_date, 'yyyy-MM-dd')?.toString();
            controls['task_date'].setValue(taskDate);
            controls['start_work_date'].setValue(startWorkDate);
            controls['appointment_date'].setValue(appointmentDate);
            controls['statusPhase'].setValue(this.dbTask.status);

            if(this.isDisbleStatus() ||  this.isCustomer()){
              this.dbTaskForm.disable({ onlySelf: true, emitEvent: false });  
              this.dbTask.taskDetail.forEach(row => row.form?.disable({ onlySelf: true, emitEvent: false })); 
            }

            if(!this.isDisbleStatus() && (this.user.userRole == 'Admin')){
              this.dbTaskForm.controls['employee_id'].enable({emitEvent: false });
            }
          });
        }
      }else{
        this.dbTask.taskDetail = [];
      }

      this.dbTaskForm.markAsPristine();
    }
    
    installEvent(){
      if(!this.isCustomer()){
        this.dbTaskForm.controls['employee_id'].setValue(this.user.userId);
      }

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
        task_no: [{value : "AUTO", disabled: true}],
        task_date: [{value : this.formattedDate, disabled: this.taskId}],
        task_amt: [{value : 0.00, disabled: true}],
        customer_id: null,
        customer_name: [null,[Validators.required]],
        customer_lastname: [null,[Validators.required]],
        customer_phone: [null,[Validators.required, CustomValidators.phoneNo()]],
        customer_company: null,
        customer_address: [null,[Validators.required]],
        employee_id: [{value : null, disabled: true }, [Validators.required]],
        license_desc: [null,[Validators.required]],
        remark: null,
        status: null,
        statusPhase: ["SAVED",[Validators.required]],
        province_id: [null,[Validators.required]],
        start_work_date: [this.formattedDate,[Validators.required]],
        appointment_date: null,
      };   
      this.dbTaskForm = this.fb.group(dbTaskControls);
    }

    addTaskDetail() {
      const taskDetail: TaskDetail = {
        task_id: 0, 
        detail_id: null,
        seq: this.dbTask.taskDetail.length + 1,
        spare_id: null,
        spare_desc: null,
        spare_bal: 0.00,
        detail_description: null,
        detail_qty: 0.00,
        detail_unit_price: 0.00,
        detail_amt: 0.00,
        rowState: 'Add',
      };
      taskDetail.form = this.createTaskDetailForm(taskDetail);
      this.dbTask.taskDetail = this.dbTask.taskDetail.concat(taskDetail); 
      this.dbTaskForm.markAsDirty();
    }
    
    createTaskDetailForm(taskDetail: TaskDetail) {
      const fg = this.fb.group({
        task_id: [taskDetail.task_id],
        detail_id: [taskDetail.detail_id],
        seq: [taskDetail.seq],
        spare_id: [taskDetail.spare_id, [Validators.required]],
        spare_desc: [taskDetail.spare_desc],
        spare_bal: [{value: taskDetail.spare_bal, disabled: true}],
        detail_description: [taskDetail.detail_description],
        detail_qty: [taskDetail.detail_qty, [Validators.required, CustomValidators.numberOnly()]],
        detail_unit_price: [taskDetail.detail_unit_price, [Validators.required, CustomValidators.numberOnly()]],
        detail_amt: [taskDetail.detail_amt],
        spare_qty_bal: 0,
        previous_detail_qty: 0,
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
          fg.controls.spare_bal.setValue(selectedRow[0].spareBal);
          fg.controls.spare_qty_bal.setValue(selectedRow[0].spareBal);
        }else{
          fg.controls.spare_desc.setValue(null);
          fg.controls.detail_unit_price.setValue(0.00);
          fg.controls.spare_bal.setValue(0.00);
          fg.controls.spare_qty_bal.setValue(0.00);
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
      if (action === 'Cancel') {
        this.onSetDetailRowState();
      }
    
      const forms: FormGroup[] = [
        ...(this.dbTaskForm ? [this.dbTaskForm] : []),
        ...(this.dbTask.taskDetail.map(detail => detail.form).filter(form => !!form) as FormGroup[])  
      ];
    
      if (this.isFormValid(forms) && this.isDetailValid()) {
          this.se.save(
            this.dbTask, 
            this.dbTaskForm.getRawValue(),
            this.taskDetailDelete,
            action
          ).pipe(
            switchMap(result => this.se.findDbTaskByKey(result)),
            catchError(error => {
              console.log(error)
              this.ms.error('บันทึกข้อมูลไม่สำเร็จ',error.error);
              throw error; 
            })
          ).subscribe((result: any) => {
              this.dbTask = result;
              this.taskId = result.dbTask.task_id;
              this.rebuildForm();
    
              if (action === 'Save') {
                this.ms.success('บันทึกสำเร็จ');
              } else if (action === 'Cancel') {
                this.ms.success('ยกเลิกข้อมูลสำเร็จ');
              }
          });
      }
    }
    onSetDetailRowState(){
      this.dbTask.taskDetail.forEach(res => {
        if (res.rowState === 'Normal') {
          res.rowState = "Edit";
        }
      });
    }

    isDisbleStatus():boolean{
      let disable = false;
      if(this.dbTaskForm.controls['status'].value == 'CANCELLED'  
      || this.dbTaskForm.controls['status'].value == 'CONFIRMED_PAYMENT'){
        disable = true;
      }
      return disable;
    }

    isCustomer():boolean{
      let disable = false;
      if(this.user.userRole == 'customer'){
        disable = true;
      }
      return disable;
    }

    IsAuto():boolean{
      let disable = false;
      if(this.dbTaskForm.controls['task_no'].value == 'AUTO'){
        disable = true;
      }
      return disable;
    }

    isFormValid(formGroupOrArray: FormGroup | FormGroup[]): boolean { 
      let isValid = true;
    
      const checkValidity = (group: FormGroup) => {
        Object.values(group.controls).forEach(control => {
          if (control instanceof FormGroup) {
            checkValidity(control); 
          } else {
            control.markAsTouched();
            if (control.invalid) { 
              isValid = false;
            }
          }
        });
      };
    
      if (Array.isArray(formGroupOrArray)) { 
        formGroupOrArray.forEach(formGroup => checkValidity(formGroup)); 
      } else {
        checkValidity(formGroupOrArray); 
      }
    
      if (!isValid) {
        this.ms.error('กรุณาตรวจสอบข้อมูลให้ถูกต้อง');
      }
    
      return isValid;
    }
  
    isInvalid(controlName: string){  
      const control = this.dbTaskForm.get(controlName);
      return control ? control.touched && control.invalid : false; 
    }

    isDetailValid():boolean{
      let isValidate = true
      const detailAmtValid:boolean = this.dbTask.taskDetail.some(row => row.form?.controls['detail_amt'].value <= 0);
      const spareBalValid:boolean = this.dbTask.taskDetail.some(row => row.form?.controls['spare_bal'].value < row.form?.controls['detail_qty'].value);

      if(this.dbTask.taskDetail.length > 0 && detailAmtValid){
        this.ms.warning('ไม่สามารถบันทึกรายการอะไหล่มูลค่าน้อยกว่าหรือเท่ากับ 0 ได้');
        return isValidate = false
      }

      if(this.dbTask.taskDetail.length > 0 && (spareBalValid || this.validateSpareQtyBal())){
        this.ms.warning('ไม่สามารถบันทึกอะไหล่ที่มีจำนวนมากกว่าจำนวนคงเหลือที่อยู่ในคลังได้ กรุณาตรวจสอบ');
        return isValidate = false
      }

      return isValidate
    }

    validateSpareQtyBal(): boolean {
      return this.dbTask.taskDetail.some(row => {
        if (row.form) {
        // A item = qty: 20 ,bal: 20
        // task M = qty: 15 ,A item bal: 20-15 = 5
        // task L = qty: 5  ,A item bal: 5-5 = 0
          const previousDetailQty = row.form.controls['previous_detail_qty'].value;  //5
          const detailQty = +row.form.controls['detail_qty'].value; //8
          const spareQtyBal = row.form.controls['spare_qty_bal'].value; //0
          const SpareQtyBal = previousDetailQty + spareQtyBal; //5+0
  
          return detailQty > SpareQtyBal; // 8>5
        }
        return false;
      });
    }

// ------------------------------------------------------------------------------------

 


}
