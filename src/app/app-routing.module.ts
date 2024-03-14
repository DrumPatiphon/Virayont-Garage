import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CusComponent } from './spa/cus/cus.component';
import { EmpComponent } from './spa/emp/emp.component';
import { EmpDetailComponent } from './spa/emp-detail/emp-detail.component';
import { CusDetailComponent } from './spa/cus-detail/cus-detail.component';
import { SpareComponent } from './spa/spare/spare.component';
import { TaskComponent } from './spa/task/task.component';
import { TaskDetailComponent } from './spa/task/task-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'home', component: HomeComponent },
  { path: 'cus', component: CusComponent },
  { path: 'emp', component: EmpComponent },
  { path: 'spare', component: SpareComponent },
  { path: 'emp-detail', component: EmpDetailComponent },
  { path: 'cus-detail', component: CusDetailComponent }, 
  { path: 'task', component: TaskComponent }, 
  { path: 'task/detail', component: TaskDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// export const RoutingComponents = [CusComponent,CusDetailComponent,EmpComponent,EmpDetailComponent,SpareComponent]