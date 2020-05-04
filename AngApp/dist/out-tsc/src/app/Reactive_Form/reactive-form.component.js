import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CustomValidator } from '../Shared/custom.validator';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../Services/employee.service';
var ReactiveFormComponent = /** @class */ (function () {
    function ReactiveFormComponent(fb, route, employeeService) {
        this.fb = fb;
        this.route = route;
        this.employeeService = employeeService;
        //formErrors = {
        //  'fullName': '',
        //  'email': '',
        //  'confirmEmail': '',
        //  'emailGroup': '',
        //  'phone': '',
        //  'skillName': '',
        //  'experienceInYears': '',
        //  'proficiency': ''
        //};
        //On the formErrors object also, delete the skill related properties.In fact, we do not need any of the properties on the formErrors object, as they will be dynamically added when the corresponding form control fails validation.Notice, I have commented all the properties on the formErrors object. 
        this.formErrors = {
        //'fullName': '',
        //'email': '',
        //'confirmEmail': '',
        //'emailGroup': '',
        //'phone': '',
        //'skillName': '',
        //'experienceInYears': '',
        //'proficiency': ''
        };
        // Include required error message for phone form control
        //validationMessages = {
        //  'fullName': {
        //    'required': 'Full Name is required.',
        //    'minlength': 'Full Name must be greater than 2 characters',
        //    'maxlength': 'Full Name must be less than 10 characters.',
        //  },
        //  'email': {
        //    'required': 'Email is required.',
        //    'emailDomain': 'Email domain should be dell.com'
        //  },
        //  'phone': {
        //    'required': 'Phone is required.'
        //  },
        //  'skillName': {
        //    'required': 'Skill Name is required.',
        //  },
        //  'experienceInYears': {
        //    'required': 'Experience is required.',
        //  },
        //  'proficiency': {
        //    'required': 'Proficiency is required.',
        //  },
        //};
        this.validationMessages = {
            'fullName': {
                'required': 'Full Name is required.',
                'minlength': 'Full Name must be greater than 2 characters',
                'maxlength': 'Full Name must be less than 10 characters.',
            },
            'email': {
                'required': 'Email is required.',
                'emailDomain': 'Email domian should be dell.com'
            },
            'confirmEmail': {
                'required': 'Confirm Email is required.'
            },
            'emailGroup': {
                'emailMismatch': 'Email and Confirm Email do not match.'
            },
            'phone': {
                'required': 'Phone is required.'
            },
        };
    }
    ReactiveFormComponent.prototype.ngOnInit = function () {
        //this.employeeForm = new FormGroup({
        //  fullName: new FormControl(),
        //  email: new FormControl(),
        //  // Create skills form group
        //  skills: new FormGroup({
        //    skillName: new FormControl(),
        //    experienceInYears: new FormControl(),
        //    proficiency: new FormControl()
        //  })
        //});
        var _this = this;
        //this.employeeForm = this.fb.group({
        //  fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
        //  contactPreference:['email'],
        //  email: ['', [Validators.required, CustomValidator.emailDomain('dell.com')]],
        //  phone:[''],
        //  skills: this.fb.group({
        //    skillName: ['', Validators.required],
        //    experienceInYears: ['', Validators.required],
        //    proficiency: ['', Validators.required]
        //  }),
        //});
        this.employeeForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
            contactPreference: ['email'],
            emailGroup: this.fb.group({
                email: ['', [Validators.required, CustomValidator.emailDomain('dell.com')]],
                confirmEmail: ['', [Validators.required]],
            }, { validator: matchEmails }),
            phone: [''],
            //skills: this.fb.group({
            //  skillName: ['', Validators.required],
            //  experienceInYears: ['', Validators.required],
            //  proficiency: ['', Validators.required]
            //}),
            skills: this.fb.array([
                this.addSkillFormGroup()
            ])
        });
        // When any of the form control value in employee form changes
        // our validation function logValidationErrors() is called
        this.employeeForm.valueChanges.subscribe(function (data) {
            _this.logValidationErrors(_this.employeeForm);
        });
        this.employeeForm.get('contactPreference')
            .valueChanges.subscribe(function (data) {
            _this.onContactPrefernceChange(data);
        });
        this.route.paramMap.subscribe(function (params) {
            var empId = +params.get('employeeId');
            if (empId) {
                _this.getEmployee(empId);
            }
        });
    };
    ReactiveFormComponent.prototype.getEmployee = function (id) {
        var _this = this;
        this.employeeService.getEmployee(id)
            .subscribe(function (employee) { return _this.editEmployee(employee); }, function (err) { return console.log(err); });
    };
    ReactiveFormComponent.prototype.editEmployee = function (employee) {
        this.employeeForm.patchValue({
            fullName: employee.fullName,
            contactPreference: employee.contactPreference,
            emailGroup: {
                email: employee.email,
                confirmEmail: employee.email
            },
            phone: employee.phone
        });
    };
    // If the Selected Radio Button value is "phone", then add the
    // required validator function otherwise remove it
    ReactiveFormComponent.prototype.onContactPrefernceChange = function (selectedValue) {
        var phoneFormControl = this.employeeForm.get('phone');
        //const emailFormControl = this.employeeForm.get('email');
        var emailGroup = this.employeeForm.get('emailGroup');
        var emailFormControl = emailGroup.get('email');
        //const confirmemailFormControl = this.employeeForm.get('confirmEmail');
        var confirmemailFormControl = emailGroup.get('confirmEmail');
        var emailGroupControl = this.employeeForm.get('emailGroup');
        if (selectedValue === 'phone') {
            phoneFormControl.setValidators(Validators.required);
            emailFormControl.clearValidators();
            emailGroupControl.clearValidators();
            confirmemailFormControl.clearValidators();
        }
        else {
            phoneFormControl.clearValidators();
            emailFormControl.setValidators([Validators.required, CustomValidator.emailDomain('dell.com')]);
            emailGroupControl.setValidators(matchEmails);
            confirmemailFormControl.setValidators(Validators.required);
        }
        phoneFormControl.updateValueAndValidity();
        emailFormControl.updateValueAndValidity();
        confirmemailFormControl.updateValueAndValidity();
        emailGroupControl.updateValueAndValidity();
    };
    ReactiveFormComponent.prototype.removeSkillButtonClick = function (skillGroupIndex) {
        this.employeeForm.get('skills').removeAt(skillGroupIndex);
    };
    ReactiveFormComponent.prototype.addSkillFormGroup = function () {
        return this.fb.group({
            skillName: ['', Validators.required],
            experienceInYears: ['', Validators.required],
            proficiency: ['', Validators.required]
        });
    };
    ReactiveFormComponent.prototype.onSubmit = function () {
        console.log(this.employeeForm.value);
        console.log(Object.keys(this.employeeForm.controls));
    };
    ReactiveFormComponent.prototype.addSkillButtonClick = function () {
        this.employeeForm.get('skills').push(this.addSkillFormGroup());
    };
    ReactiveFormComponent.prototype.onLoadDataClick = function () {
        //  this.employeeForm.setValue({
        //    fullName: 'Rahul Chauhan',
        //    email: 'rahulchauhan@gmail.com',
        //    skills: {
        //      skillName: 'C#',
        //      experienceInYears: 5,
        //      proficiency: 'beginner'
        //    }
        //  });
    };
    // PatchValue
    //onLoadDataClick(): void {
    //  this.employeeForm.patchValue({
    //    fullName: 'Pragim Technologies',
    //    email: 'pragim@pragimtech.com',
    //    // skills: {
    //    //   skillName: 'C#',
    //    //   experienceInYears: 5,
    //    //   proficiency: 'beginner'
    //    // }
    //  });
    //}
    //logValidationErrors(group: FormGroup = this.employeeForm): void {
    //  Object.keys(group.controls).forEach((key: string) => {
    //    const abstractControl = group.get(key);
    //    if (abstractControl instanceof FormGroup) {
    //      this.logValidationErrors(abstractControl);
    //    } else {
    //      this.formErrors[key] = '';
    //      if (abstractControl && !abstractControl.valid
    //        && (abstractControl.touched || abstractControl.dirty)) {
    //        const messages = this.validationMessages[key];
    //        for (const errorKey in abstractControl.errors) {
    //          if (errorKey) {
    //            this.formErrors[key] += messages[errorKey] + ' ';
    //          }
    //        }
    //      }
    //    }
    //  });
    //}
    ReactiveFormComponent.prototype.logValidationErrors = function (group) {
        var _this = this;
        if (group === void 0) { group = this.employeeForm; }
        Object.keys(group.controls).forEach(function (key) {
            var abstractControl = group.get(key);
            _this.formErrors[key] = '';
            // Loop through nested form groups and form controls to check
            // for validation errors. For the form groups and form controls
            // that have failed validation, retrieve the corresponding
            // validation message from validationMessages object and store
            // it in the formErrors object. The UI binds to the formErrors
            // object properties to display the validation errors.
            //if (abstractControl && !abstractControl.valid
            //  && (abstractControl.touched || abstractControl.dirty))
            // abstractControl.value !== '' (This condition ensures if there is a value in the
            // form control and it is not valid, then display the validation error)
            if (abstractControl && !abstractControl.valid &&
                (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
                var messages = _this.validationMessages[key];
                for (var errorKey in abstractControl.errors) {
                    if (errorKey) {
                        _this.formErrors[key] += messages[errorKey] + ' ';
                    }
                }
            }
            if (abstractControl instanceof FormGroup) {
                _this.logValidationErrors(abstractControl);
            }
            // We need this additional check to get to the FormGroup
            // in the FormArray and then recursively call this
            // logValidationErrors() method to fix the broken validation
            //if (abstractControl instanceof FormArray) {
            //  for (const control of abstractControl.controls) {
            //    if (control instanceof FormGroup) {
            //      this.logValidationErrors(control);
            //    }
            //  }
            //}
        });
    };
    ReactiveFormComponent = tslib_1.__decorate([
        Component({
            selector: 'reactive-form',
            templateUrl: './reactive-form.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [FormBuilder, ActivatedRoute,
            EmployeeService])
    ], ReactiveFormComponent);
    return ReactiveFormComponent;
}());
export { ReactiveFormComponent };
function emailDomain(control) {
    var email = control.value;
    var domain = email.substring(email.lastIndexOf('@') + 1);
    if (email === '' || domain.toLowerCase() === 'pragimtech.com') {
        return null;
    }
    else {
        return { 'emailDomain': true };
    }
}
function matchEmails(group) {
    var emailControl = group.get('email');
    var confirmEmailControl = group.get('confirmEmail');
    //if (emailControl.value === confirmEmailControl.value || confirmEmailControl.pristine)
    if (emailControl.value === confirmEmailControl.value
        || (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
        return null;
    }
    else {
        return { 'emailMismatch': true };
    }
}
//# sourceMappingURL=reactive-form.component.js.map