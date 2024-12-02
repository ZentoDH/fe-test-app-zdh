import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private notificationService: NotificationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                this.notificationService.displayNotification(error.error.message, false, 5000);

                return throwError(error);
            })
        );
    }
}
