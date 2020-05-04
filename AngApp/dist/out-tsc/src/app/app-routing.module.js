import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListComponent } from './Reactive_Form/list.component';
import { ReactiveFormComponent } from './Reactive_Form/reactive-form.component';
var routes = [
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
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib_1.__decorate([
        NgModule({
            imports: [RouterModule.forRoot(routes)],
            exports: [RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map