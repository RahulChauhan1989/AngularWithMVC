import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { EmployeeService } from '../Services/employee.service';
import { Router } from '@angular/router';
var ListComponent = /** @class */ (function () {
    function ListComponent(_employeeService, _router) {
        this._employeeService = _employeeService;
        this._router = _router;
    }
    ListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._employeeService.getEmployees().subscribe(function (employeeList) { return _this.employees = employeeList; }, function (err) { return console.log(err); });
    };
    ListComponent.prototype.editButtonClick = function (employeeId) {
        this._router.navigate(['/Edit', employeeId]);
    };
    ListComponent = tslib_1.__decorate([
        Component({
            selector: 'app-list',
            templateUrl: './list.component.html',
            styleUrls: ['./list.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [EmployeeService, Router])
    ], ListComponent);
    return ListComponent;
}());
export { ListComponent };
//# sourceMappingURL=list.component.js.map