import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
var EmployeeService = /** @class */ (function () {
    function EmployeeService(httpClient) {
        this.httpClient = httpClient;
        this.baseUrl = 'http://localhost:3000/employees';
    }
    EmployeeService.prototype.getEmployees = function () {
        return this.httpClient.get(this.baseUrl)
            .pipe(catchError(this.handleError));
    };
    EmployeeService.prototype.handleError = function (errorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.error('Client Side Error :', errorResponse.error.message);
        }
        else {
            console.error('Server Side Error :', errorResponse);
        }
        return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    };
    EmployeeService.prototype.getEmployee = function (id) {
        return this.httpClient.get(this.baseUrl + "/" + id)
            .pipe(catchError(this.handleError));
    };
    EmployeeService.prototype.addEmployee = function (employee) {
        return this.httpClient.post(this.baseUrl, employee, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    };
    EmployeeService.prototype.updateEmployee = function (employee) {
        return this.httpClient.put(this.baseUrl + "/" + employee.id, employee, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
            .pipe(catchError(this.handleError));
    };
    EmployeeService.prototype.deleteEmployee = function (id) {
        return this.httpClient.delete(this.baseUrl + "/" + id)
            .pipe(catchError(this.handleError));
    };
    EmployeeService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [HttpClient])
    ], EmployeeService);
    return EmployeeService;
}());
export { EmployeeService };
//# sourceMappingURL=employee.service.js.map