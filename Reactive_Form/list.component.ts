import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../Services/employee.service';
import { IEmployee } from '../Interface/IEmployee';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  employees: IEmployee[];

  constructor(private _employeeService: EmployeeService, private _router: Router) { }

  ngOnInit() {
    this._employeeService.getEmployees().subscribe(
      (employeeList) => this.employees = employeeList,
      (err) => console.log(err)
    );
  }
  editButtonClick(employeeId: number) {
    this._router.navigate(['/Edit', employeeId]);
    
  }


}
