import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from 'src/app/_models/user.model';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { instantErrorFormfield } from 'src/app/_validators/instant-error-formfield.validator';
import { NotificationService } from 'src/app/notifications/notification.service';
import { Router } from '@angular/router';


@Component({
  selector: 'exads-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit, OnDestroy {
  matcher = new instantErrorFormfield();
  isCreating: boolean = false;

  private ngUnsubscribe = new Subject();

  profileForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[^{}"[\]\.!]+$/),
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl(''),
    email: new FormControl('', [Validators.email, Validators.required]),
  });

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router) { }

  ngOnInit() {
    this.checkUsername();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  checkUsername(): void {
    this.profileForm.get('username').valueChanges.pipe(
      debounceTime(400),
      takeUntil(this.ngUnsubscribe),
      switchMap((username: string) => {
        if (username !== "") {
          return this.userService.getUserByUserName(username).pipe(
            map(response => response.data.users)
          );
        } else {
          return of([]);
        }
      })
    ).subscribe(users => {
      if (users.length) {
        this.profileForm.get('username').setErrors({
          'notUnique': true
        })
      } else {
        let currentErrors = this.profileForm.get('username').errors;
        if (currentErrors) delete currentErrors.notUnique;
        this.profileForm.get('username').setErrors(currentErrors);
      }
      this.profileForm.get('username').markAsTouched();
    })
  }

  createUser() {
    let user: User = {
      first_name: this.profileForm.get('first_name').value,
      last_name: this.profileForm.get('last_name').value,
      email: this.profileForm.get('email').value,
      username: this.profileForm.get('username').value,
      id_status: 1
    }
    if (!this.profileForm.get('last_name').value) delete user.last_name
    console.log('start creating user')
    this.profileForm.disable();
    this.isCreating = true
    this.userService.createUser(user).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.notificationService.displayNotification(res.message, true)
      this.router.navigate(['users'])
    }, err => {
      this.profileForm.enable();
      this.isCreating = false;
    })
  }

}
