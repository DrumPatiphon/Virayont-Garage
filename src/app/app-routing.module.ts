import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CusComponent } from './spa/cus/cus.component';
import { EmpComponent } from './spa/emp/emp.component';
import { EmpDetailComponent } from './spa/emp-detail/emp-detail.component';
import { CusDetailComponent } from './spa/cus-detail/cus-detail.component';
import { SpareComponent } from './spa/spare/spare.component';
import { TaskComponent } from './spa/task/task.component';
import { TaskDetailComponent } from './spa/task/task-detail.component';
import { EmpPdetailComponent } from './spa/emp-detail/emp-pdetail/emp-pdetail.component';
import { SpareDetailComponent } from './spa/spare/spare-detail/spare-detail.component';
import { AdminComponent } from './spa/admin/admin.component';
import { CusPdetailComponent } from './spa/cus-detail/cus-pdetail/cus-pdetail.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 
  { path: 'home', component: HomeComponent },
  { path: 'cus', component: CusComponent },
  { path: 'emp', component: EmpComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'spare', component: SpareComponent },
  { path: 'spare-detail', component: SpareDetailComponent },
  { path: 'emp-detail', component: EmpDetailComponent },
  { path: 'emp-pdetail', component: EmpPdetailComponent },
  { path: 'cus-detail', component: CusDetailComponent }, 
  { path: 'cus-pdetail', component: CusPdetailComponent }, 
  { path: 'task', component: TaskComponent }, 
  { path: 'task/detail', component: TaskDetailComponent },
  { path: 'task/detail/:taskId', component: TaskDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// export const RoutingComponents = [CusComponent,CusDetailComponent,EmpComponent,EmpDetailComponent,SpareComponent]