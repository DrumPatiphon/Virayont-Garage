import { Component ,OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService ,DbTask, TaskDetail, UserData} from './api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { finalize, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { faSave,faPlus,faXmark } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomValidators } from 'src/app/shared/Validators/custom.validators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task',
  templateUrl: './task-detail.component.html',
  styleUrls: [ './task.component.css']
})
export class TaskDetailComponent implements OnInit{

  saveIcon = faSave
  cancelIcon = faXmark
  addIcon = faPlus

    dbTaskForm! : FormGroup;  //่ ! มีไว้เพื่อไม่ให้error เพราะมันไม่สามารถว่างได้ 
    dbTask : DbTask = {} as DbTask; // คือการสร้างอ็อบเจ็คของ DbTask โดยไม่มีค่าเริ่มต้น
    taskDetailDelete: TaskDetail[] = [] as TaskDetail[]; // การสร้างอาร์เรย์ของ TaskDetail โดยไม่มีข้อมูลเริ่มต้นใด ๆ
    user: UserData = {} as UserData; 
    masterData = {  // เป็นอ็อบเจกต์ที่มีโครงสร้างเสมือนฐานข้อมูลย่อย
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
      private datePipe: DatePipe,
      private authService: AuthService,
      private ms: ToastrService,
    ) {}

    taskId: number | null = null;  // กำหนดให้เป็นnumberหรือnull

    ngOnInit(): void {
      this.user = this.authService.getCurrentUser();
      if(!this.user){
        this.router.navigate(['/login']);
      }

      const taskIdParam = this.route.snapshot.paramMap.get('taskId');
      this.taskId = taskIdParam ? +taskIdParam : null;  // + คือการเปลี่ยนให้การเป็น number
      this.se.getMasterData().subscribe({
        next: (response: any) => {
          this.masterData = response;
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
      this.taskDetailDelete = [];  //เพื่อเคลียร์taskDetail ที่ลบออก

      if(this.taskId){
        const controls = this.dbTaskForm.controls
        if(this.dbTask){
          this.se.findDbTaskByKey(this.taskId).subscribe(res => {  //findDbTaskByKey(this.taskId) เอาtaskIdไปค้นหา
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
              this.dbTaskForm.disable({ onlySelf: true, emitEvent: false });  //ปิดการใช้งานของตัวเองเท่านั้น และ ข้ามการส่งevent : valuechang
              this.dbTask.taskDetail.forEach(row => row.form?.disable({ onlySelf: true, emitEvent: false })); //เพราะเป็น[]จึงต้องใช้ forEach
            }


            if(!this.isDisbleStatus() && (this.user.userRole == 'Admin' || this.user.userRole == 'CEO')){
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
        task_no: "AUTO",
        task_date: [{value : this.formattedDate, disabled: this.taskId}],
        task_amt: [{value : 0.00, disabled: true}],
        customer_id: null,
        customer_name: [null,[Validators.required]],
        customer_lastname: [null,[Validators.required]],
        customer_phone: [null,[Validators.required, CustomValidators.phoneNo()]],
        customer_company: null,
        customer_address: [null,[Validators.required]],
        employee_id: [null,[Validators.required]],
        license_desc: [null,[Validators.required]],
        remark: null,
        status: null,
        statusPhase: [null,[Validators.required]],
        province_id: [null,[Validators.required]],
        start_work_date: [this.formattedDate,[Validators.required]],
        appointment_date: null,
      };   
      this.dbTaskForm = this.fb.group(dbTaskControls);
    }

    addTaskDetail() {
      const taskDetail: TaskDetail = {
        task_id: 0, //เก็บค่าเป็นnumber
        detail_id: null,
        seq: this.dbTask.taskDetail.length + 1,
        spare_id: null,
        spare_desc: null,
        detail_description: null,
        detail_qty: 0.00,
        detail_unit_price: 0.00,
        detail_amt: 0.00,
        rowState: 'Add',
      };
      taskDetail.form = this.createTaskDetailForm(taskDetail); //สร้างแถวใหม่
      this.dbTask.taskDetail = this.dbTask.taskDetail.concat(taskDetail);  //ทำให้ข้อมูลเท่ากับแถวข้างบน(ต่อ)
      // this.pagedData = this.dbTask.taskDetail;
      this.dbTaskForm.markAsDirty();
    }
    
    createTaskDetailForm(taskDetail: TaskDetail) {
      const fg = this.fb.group({
        task_id: [taskDetail.task_id],
        detail_id: [taskDetail.detail_id],
        seq: [taskDetail.seq],
        spare_id: [taskDetail.spare_id, [Validators.required]],
        spare_desc: [taskDetail.spare_desc],
        detail_description: [taskDetail.detail_description],
        detail_qty: [taskDetail.detail_qty, [Validators.required, CustomValidators.numberOnly()]],
        detail_unit_price: [taskDetail.detail_unit_price, [Validators.required, CustomValidators.numberOnly()]],
        detail_amt: [taskDetail.detail_amt],
      });

      fg.patchValue(taskDetail, { emitEvent: false });  
  
      if (this.dbTaskForm.controls['task_no'].value == 'AUTO') {
        taskDetail.rowState = 'Add';
      }
  
      fg.valueChanges.subscribe((controls) => {  //เป็นการทำไปที่ละตัว
        if (taskDetail.rowState === 'Normal') { // เป็นการเช็ค
          taskDetail.rowState = 'Edit';
        }
      });

      fg.controls.spare_id.valueChanges.subscribe(selectedValue => {
        if(fg.controls.spare_id.dirty && selectedValue){
          const selectedRow = (this.masterData.spareData as any[]).filter(row => row.value == selectedValue);  //as any[] คือเอาข้อมูลทั้งหมดของdataนั้นๆ
          fg.controls.spare_desc.setValue(selectedRow[0].spareName);
          fg.controls.detail_unit_price.setValue(selectedRow[0].sparePrice);
        }else{
          fg.controls.spare_desc.setValue(null);
          fg.controls.detail_unit_price.setValue(0.00);
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
      .reduce((total, num) => (total + num.form?.controls['detail_amt'].value || 0), 0);  //reduce การทำลูปเพื่อหาผลรวมของ[]

      this.dbTaskForm.controls['task_amt'].setValue(sumtaskdetail || 0);
    }

    save(action: string) {
      if(action == 'Cancel'){
        this.onSetDetailRowState();
      }
      const forms: FormGroup[] = [
        ...(this.dbTaskForm ? [this.dbTaskForm] : []),
        ...(this.dbTask.taskDetail.map(detail => detail.form).filter(form => !!form) as FormGroup[])
      ];  //map เพื่อดึงค่า form จากทุกๆ detail ใน this.dbTask.taskDetail เพื่อfiltter เฉพาะค่าที่ไม่ใช่ null
        if (this.isFormValid(forms)) { 
          this.se.save(this.dbTask,  //เป็นข้อมูลที่ต้องการนำมาsave
                       this.dbTaskForm.getRawValue(),
                       this.taskDetailDelete,
                       action,
            )
            .pipe(
            switchMap(result => this.se.findDbTaskByKey(result))
          ).subscribe((result: any) => {
            this.dbTask = result;
            this.taskId = result.dbTask.task_id;
            this.rebuildForm();
          });
          if(action == 'Save'){
            this.ms.success('บันทึกสำเร็จ');
          }else if(action == 'Cancel'){
            this.ms.success('ยกเลิกข้อมูลสำเร็จ');
          }
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
      if(this.dbTaskForm.controls['status'].value == 'CANCELLED' || this.dbTaskForm.controls['status'].value == 'COMPLETED'){
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

    isFormValid(formGroupOrArray: FormGroup | FormGroup[]): boolean {  //***** 
      let isValid = true;
    
      const checkValidity = (group: FormGroup) => {
        Object.values(group.controls).forEach(control => {
          if (control instanceof FormGroup) {
            checkValidity(control); // เอาข้อมูลในform มาเช็คว่ามีค่าตรงกันมั้ย
          } else {
            control.markAsTouched();
            if (control.invalid) { //เช็คว่าถูกต้องมั้ย อีกครั้ง
              isValid = false;
            }
          }
        });
      };
    
      if (Array.isArray(formGroupOrArray)) { // เช็คข้อมูลว่าเป็นarrayหรือไม่
        formGroupOrArray.forEach(formGroup => checkValidity(formGroup)); //ถ้าเป็นจะวนลูปผ่านทุก FormGroup
      } else {
        checkValidity(formGroupOrArray); //ถ้าไม่ใช่ Array ก็เรียกใช้ checkValidity โดยตรงกับ FormGroup
      }
    
      if (!isValid) {
        this.ms.error('กรุณาตรวจสอบข้อมูลให้ถูกต้อง');
      }
    
      return isValid;
    }
  
    isInvalid(controlName: string){  //เอาไว้เช็คtastdetail
      const control = this.dbTaskForm.get(controlName);
      return control ? control.touched && control.invalid : false; // สั่งให้เป็น touch และถ้าเป็น invalid ให้ส่ง false ไป
    }
    

    // onPageChange(event: any) {
    //   const startIndex = event.pageIndex * event.pageSize;
    //   const endIndex = startIndex + event.pageSize;
    //   this.pagedData = this.dbTask.taskDetail.slice(startIndex, endIndex);
    // }

// ------------------------------------------------------------------------------------

 


}
