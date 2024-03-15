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
import { CusComponent } from './spa/cus/cus.component';
import { EmpComponent } from './spa/emp/emp.component';
import { CusDetailComponent } from './spa/cus-detail/cus-detail.component';
import { EmpDetailComponent } from './spa/emp-detail/emp-detail.component';
import { SpareComponent } from './spa/spare/spare.component';
import { TaskComponent } from './spa/task/task.component';
import { TaskDetailComponent } from './spa/task/task-detail.component';
import { AppTableComponent } from './shared/app-table/app-table.component';
import { AppTableColumnComponent } from './shared/app-table-column/app-table-column.component';
import { SelectInputComponent } from './shared/select-input/select-input.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CusComponent,
    EmpComponent,
    CusDetailComponent,
    EmpDetailComponent,
    SpareComponent,
    TaskComponent,
    TaskDetailComponent,
    AppTableComponent,
    AppTableColumnComponent,
    SelectInputComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
