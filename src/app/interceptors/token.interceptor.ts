import {Injectable} from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
    HttpHeaders
} from '@angular/common/http';

import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, switchMap, filter, take, } from 'rxjs/operators';

import { AlertController, ToastController } from '@ionic/angular';
import { SERVER_URL } from 'src/config';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    protected debug = true;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    isRefreshingToken = false;

    constructor(private auth: AuthenticationService, private toastCtrl: ToastController) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Check if we need additional token logic or not
      if (this.isInBlockedList(request.url)) {
        return next.handle(request);
      } else {
        return next.handle(this.addToken(request)).pipe(
          catchError(err => {
            if (err instanceof HttpErrorResponse) {
              switch (err.status) {
                case 400:
                  return this.handle400Error(err);
                case 401:
                  return this.handle400Error(err);
                  return this.handle401Error(request, next);
                case 403:
                  return this.handle403Error(err);
                case 500:
                  return this.handle500Error(err);
                case 503:
                  return this.handle503Error(err);
                default:
                  return throwError(err);
              }
            } else {
              return throwError(err);
            }
          })
        );
      }
    }

    // Filter out URLs where you don't want to add the token!
    private isInBlockedList(url: string): Boolean {
      // Example: Filter out our login and logout API call
      if (url == `${SERVER_URL}/api/v2/login` || url == `${SERVER_URL}/api/v2/logout`) {
        return true;
      } else {
        return false;
      }
    }

    // Add our current access token from the service if present
    private addToken(req: HttpRequest<any>) {
      if (this.auth.token) {
        return req.clone({
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.auth.token}`
          })
        });
      } else {
        return req;
      }
    }

    private async handle400Error(err) {
      // Potentially check the exact error reason for the 400
      // then log out the user automatically
      const toast = await this.toastCtrl.create({
        message: 'Logged out due to authentication mismatch',
        duration: 2000
      });
      toast.present();
      this.auth.logout();
      return of(null);
    }

    private async handle500Error(err) {
      // Potentially check the exact error reason for the 500
      const toast = await this.toastCtrl.create({
        header: 'Internal Server Error',
        duration: 10000,
        message: 'We have been notified of this issue. If this problem persists, please contact us',
        color: 'danger',
        position: 'top',
        buttons: [
          {
            side: 'start',
            icon: 'alert-circle-outline',
            handler: () => {
              console.log('Icon clicked');
            }
          }, {
            text: 'Dismiss',
            role: 'cancel',
            handler: () => {
              console.log('Dismiss clicked');
            }
          }
        ]
      });
      toast.present();
      return of(null);
    }

    private async handle403Error(err) {
      // Potentially check the exact error reason for the 403
      const toast = await this.toastCtrl.create({
        header: 'Forbidden',
        duration: 10000,
        message: err.error.message ? err.error.message : 'You are not allowed to perform this action',
        color: 'warning',
        position: 'top',
        buttons: [
          {
            side: 'start',
            icon: 'warning-outline',
            handler: () => {
              console.log('Icon clicked');
            }
          }, {
            text: 'Dismiss',
            role: 'cancel',
            handler: () => {
              console.log('Dismiss clicked');
            }
          }
        ]
      });
      toast.present();
      return of(null);
    }


    private async handle503Error(err) {
      // Potentially check the exact error reason for the 403
      const toast = await this.toastCtrl.create({
        header: 'Service Unavailable',
        duration: 10000,
        message: 'Our servers are undergoing maintenance, please wait and try again',
        color: 'warning',
        position: 'top',
        buttons: [
          {
            side: 'start',
            icon: 'warning-outline',
            handler: () => {
              console.log('Icon clicked');
            }
          }, {
            text: 'Dismiss',
            role: 'cancel',
            handler: () => {
              console.log('Dismiss clicked');
            }
          }
        ]
      });
      toast.present();
      return of(null);
    }

    // Indicates our access token is invalid, try to load a new one
    private handle401Error(request: HttpRequest < any >, next: HttpHandler): Observable < any > {
      // Check if another call is already using the refresh logic
      if(!this.isRefreshingToken) {

      } else {
        // "Queue" other calls while we load a new token
        return this.tokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap(token => {
            // Perform the request again now that we got a new token!
            return next.handle(this.addToken(request));
          })
        );
      }
    }
}
