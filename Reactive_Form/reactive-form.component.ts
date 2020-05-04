import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, FormArray } from '@angular/forms';
import { CustomValidator } from '../Shared/custom.validator';
import { Router } from '@angular/router';

import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../Services/employee.service';
import { IEmployee } from '../Interface/IEmployee';
import { ISkill } from '../Interface/ISkill';

@Component({
  selector: 'reactive-form',
  templateUrl: './reactive-form.component.html',
})
export class ReactiveFormComponent implements OnInit {

  employeeForm: FormGroup;

  employee: IEmployee;
  pageTitle: string;

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
  formErrors = {
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

  validationMessages = {
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
    //'skillName': {
    //  'required': 'Skill Name is required.',
    //},
    //'experienceInYears': {
    //  'required': 'Experience is required.',
    //},
    //'proficiency': {
    //  'required': 'Proficiency is required.',
    //},
  };


  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private employeeService: EmployeeService, private router: Router) { }


  ngOnInit() {

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
    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.employeeForm.get('contactPreference')
      .valueChanges.subscribe((data: string) => {
        this.onContactPrefernceChange(data);
      });

    //this.route.paramMap.subscribe(params => {
    //  const empId = +params.get('employeeId');
    //  if (empId) {
    //    this.getEmployee(empId);
    //  }
    //});

    this.route.paramMap.subscribe(params => {
      const empId = +params.get('employeeId');
      if (empId) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });

  }

  //getEmployee(id: number) {
  //  this.employeeService.getEmployee(id)
  //    .subscribe(
  //      (employee: IEmployee) => this.editEmployee(employee),
  //      (err: any) => console.log(err)
  //    );
  //}

  getEmployee(id: number) {
    this.employeeService.getEmployee(id)
      .subscribe(
        (employee: IEmployee) => {
          // Store the employee object returned by the
          // REST API in the employee property
          this.employee = employee;
          this.editEmployee(employee);
        },
        (err: any) => console.log(err)
      );
  }





  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }

  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    });

    return formArray;
  }



  // If the Selected Radio Button value is "phone", then add the
  // required validator function otherwise remove it
  onContactPrefernceChange(selectedValue: string) {
    const phoneFormControl = this.employeeForm.get('phone');
    //const emailFormControl = this.employeeForm.get('email');
    const emailGroup = this.employeeForm.get('emailGroup');
    const emailFormControl = emailGroup.get('email');
    //const confirmemailFormControl = this.employeeForm.get('confirmEmail');
    const confirmemailFormControl = emailGroup.get('confirmEmail');

    const emailGroupControl = this.employeeForm.get('emailGroup');
    if (selectedValue === 'phone') {
      phoneFormControl.setValidators(Validators.required);
      emailFormControl.clearValidators();
      emailGroupControl.clearValidators();
      confirmemailFormControl.clearValidators();
    } else {
      phoneFormControl.clearValidators();      
      emailFormControl.setValidators([Validators.required, CustomValidator.emailDomain('dell.com')]);
      emailGroupControl.setValidators(matchEmails);
      confirmemailFormControl.setValidators(Validators.required);
    }
    phoneFormControl.updateValueAndValidity();
    emailFormControl.updateValueAndValidity();
    confirmemailFormControl.updateValueAndValidity();
    emailGroupControl.updateValueAndValidity();
  }


  //removeSkillButtonClick(skillGroupIndex: number): void {
  //  (<FormArray>this.employeeForm.get('skills')).removeAt(skillGroupIndex);
  //}

  removeSkillButtonClick(skillGroupIndex: number): void {
    const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }


  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }


  
  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();

    if (this.employee.id) {
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['List']),
        (err: any) => console.log(err)
      );
    } else {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['List']),
        (err: any) => console.log(err)
      );
    }
  }

  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }




  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  onLoadDataClick(): void {
  //  this.employeeForm.setValue({
  //    fullName: 'Rahul Chauhan',
  //    email: 'rahulchauhan@gmail.com',
  //    skills: {
  //      skillName: 'C#',
  //      experienceInYears: 5,
  //      proficiency: 'beginner'
  //    }
  //  });
  }
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

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
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
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== ''))
      {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
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
  }

}

function emailDomain(control: AbstractControl): { [key: string]: any } | null {
  const email: string = control.value;
  const domain = email.substring(email.lastIndexOf('@') + 1);
  if (email === '' || domain.toLowerCase() === 'pragimtech.com') {
    return null;
  } else {
    return { 'emailDomain': true };
  }
}

function matchEmails(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  //if (emailControl.value === confirmEmailControl.value || confirmEmailControl.pristine)
  if (emailControl.value === confirmEmailControl.value
    || (confirmEmailControl.pristine && confirmEmailControl.value === ''))
  {
    return null;
  } else {
    return { 'emailMismatch': true };
  }
}
