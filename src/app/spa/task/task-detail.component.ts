import { Component ,OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ApiService, Spare4Task ,Dbtask} from './api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskDetailComponent implements OnInit{

    SpareTaskForm! : FormGroup;
    DbtaskForm! : FormGroup;

    constructor ( 
      private fb : FormBuilder,
      private se : ApiService,
      private route: ActivatedRoute,
      private router: Router,
    ) {}

    taskNo: string | undefined;
    SpareTask: Spare4Task [] = [];
    Dbtask: Dbtask [] =[]; 
    ngOnInit(): void {
      this.taskNo = this.route.snapshot.paramMap.get('taskNo') || '';
      console.log(this.taskNo)
      // this.se.getSparetask().subscribe((data) =>{ 
      //   console.log(data)
      //   this.SpareTask = data;
      // })
      // this.se.getDbtask().subscribe((data) =>{ 
      //   console.log(data)
      //   this.Dbtask = data;
      // })

      this.createForm();
      // this.se.getSparetask().subscribe((data) =>{
      //   console.log("data :",data)
      // this.SpareTask = data;
      // this.SpareTaskForm.controls['detail_id'].setValue(data[0].detail_id )
      // this.SpareTaskForm.controls['task_id'].setValue(data[0].task_id )
      // this.SpareTaskForm.controls['spare_id'].setValue(data[0].spare_id )
      
      // })

      // this.se.getDbtask().subscribe((data) =>{
      // this.Dbtask = data;
      // this.DbtaskForm.controls['task_id'].setValue(data[0].task_id )
      // this.DbtaskForm.controls['vehicle_id'].setValue(data[0].vehicle_id )
      // this.DbtaskForm.controls['date'].setValue(data[0].date )
      // this.DbtaskForm.controls['price'].setValue(data[0].price )
      // this.DbtaskForm.controls['employee_id'].setValue(data[0].employee_id )
      // this.DbtaskForm.controls['Detail'].setValue(data[0].Detail )
      // this.DbtaskForm.controls['appointment'].setValue(data[0].appointment )
      // this.DbtaskForm.controls['Repair_Status1'].setValue(data[0].Repair_Status1 )
      // this.DbtaskForm.controls['Repair_Status2'].setValue(data[0].Repair_Status2 )
      // this.DbtaskForm.controls['Repair_Status3'].setValue(data[0].Repair_Status3 )
      // this.DbtaskForm.controls['all_complete'].setValue(data[0].all_complete )
      
        
      // })


    }

    createForm() {
      const spareTaskControls = {
        detail_id: null,
        task_id: null,
        spare_id: null,
      };
    
      const dbTaskControls = {
        task_id: null,
        vehicle_id: null,
        date: null,
        price: null,
        employee_id: null,
        Detail: null,
        appointment: null,
        Repair_Status1: null,
        Repair_Status2: null,
        Repair_Status3: null,
        all_complete: null,
      };
    
      this.SpareTaskForm = this.fb.group(spareTaskControls);
      this.DbtaskForm = this.fb.group(dbTaskControls);
    }

// ------------------------------------------------------------------------------------

 


}
