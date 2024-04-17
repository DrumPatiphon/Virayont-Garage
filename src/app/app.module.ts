import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
// import {RoutingComponents} from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material-module/material.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
// import { CusComponent } from './spa/cus/cus.component';
// import { EmpComponent } from './spa/emp/emp.component';
import { CustomerComponent } from './spa/customer/customer.component';
import { EmployeeComponent } from './spa/employee/employee.component';
import { EmployeeDetailComponent } from './spa/employee/employee-detail.component';
import { SpareComponent } from './spa/spare/spare.component';
import { TaskComponent } from './spa/task/task.component';
import { TaskDetailComponent } from './spa/task/task-detail.component';
import { AppTableComponent } from './shared/app-table/app-table.component';
import { AppTableColumnComponent } from './shared/app-table-column/app-table-column.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SpareDetailComponent } from './spa/spare/spare-detail.component';
import { AdminComponent } from './spa/admin/admin.component';
import { CustomerDetailComponent } from './spa/customer/customer-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { BaseService } from './shared/base-service/base-service.component';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    // CusComponent,
    // EmpComponent,
    CustomerComponent,
    CustomerDetailComponent,
    EmployeeComponent,
    EmployeeDetailComponent,
    SpareComponent,
    TaskComponent,
    TaskDetailComponent,
    AppTableComponent,
    AppTableColumnComponent,
    SpareDetailComponent,
    AdminComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    CommonModule,
    FontAwesomeModule,
  ],
  providers: [
    BaseService,
    DatePipe,
    FontAwesomeModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
