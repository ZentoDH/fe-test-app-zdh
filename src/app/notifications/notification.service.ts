import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SnackbarComponent } from './snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notification: MatSnackBar) { }

    displayNotification(message: string, successful: boolean, length: number = 5000) {
        this.notification.openFromComponent(SnackbarComponent, { data: { successful: successful, message: message }, duration: length });
    }
}
