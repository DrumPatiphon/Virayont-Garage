import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
// import { CusComponent } from './spa/cus/cus.component';
// import { EmpComponent } from './spa/emp/emp.component';
import { EmployeeComponent } from './spa/employee/employee.component';
import { EmployeeDetailComponent } from './spa/employee/employee-detail.component';
import { CustomerComponent } from './spa/customer/customer.component';
import { CustomerDetailComponent } from './spa/customer/customer-detail.component';
import { SpareComponent } from './spa/spare/spare.component';
import { TaskComponent } from './spa/task/task.component';
import { TaskDetailComponent } from './spa/task/task-detail.component';
import { SpareDetailComponent } from './spa/spare/spare-detail.component';
import { AdminComponent } from './spa/admin/admin.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 
  { path: 'home', component: HomeComponent },
  // { path: 'cus', component: CusComponent },
  // { path: 'emp', component: EmpComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'spare', component: SpareComponent },
  { path: 'spare/detail', component: SpareDetailComponent },
  { path: 'spare/detail/:spareId', component: SpareDetailComponent },
  { path: 'emp', component: EmployeeComponent },
  { path: 'emp/detail', component: EmployeeDetailComponent },
  { path: 'emp/detail/:empId', component: EmployeeDetailComponent },
  { path: 'customer', component: CustomerComponent }, 
  { path: 'customer/detail', component: CustomerDetailComponent }, 
  { path: 'customer/detail/:customerId', component: CustomerDetailComponent }, 
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