import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
// import {RoutingComponents} from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material-module/material.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { CusComponent } from './cus/cus.component';
import { EmpComponent } from './emp/emp.component';
import { CusDetailComponent } from './cus-detail/cus-detail.component';
import { EmpDetailComponent } from './emp-detail/emp-detail.component';
import { SpareComponent } from './spare/spare.component';
import { TaskComponent } from './task/task.component';
import { TaskDetailComponent } from './task/task-detail.component';
import { AppTableComponent } from './app-table/app-table.component';
import { AppTableColumnComponent } from './app-table-column/app-table-column.component';


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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
