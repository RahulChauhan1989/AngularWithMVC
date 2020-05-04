import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './Reactive_Form/list.component';
import { ReactiveFormComponent } from './Reactive_Form/reactive-form.component';

const routes: Routes = [
  { path: 'Create', component: ReactiveFormComponent },
  { path: 'List', component: ListComponent },
  { path: 'Edit/:employeeId', component: ReactiveFormComponent },
  { path: '', redirectTo: '/Create', pathMatch: 'full' }
];

//const appRoutes: Routes = [
//  { path: 'list', component: ListEmployeesComponent },
//  { path: 'create', component: CreateEmployeeComponent },
//  { path: 'edit/:id', component: CreateEmployeeComponent },
//  { path: '', redirectTo: '/list', pathMatch: 'full' }
//];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
