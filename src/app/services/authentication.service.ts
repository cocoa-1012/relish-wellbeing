import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Storage } from '@capacitor/storage';
import { SERVER_URL } from 'src/config';
const TOKEN_KEY = 'wellbeing-token';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(private http: HttpClient,
    private router: Router,
    ) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;



      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }


  async getToken() {
    const token = await Storage.get({ key: TOKEN_KEY });

    return token.value;
  }

  login(credentials: {email, password, device_name}): Observable<any> {
    return this.http.post(`${SERVER_URL}/api/v2/login`, credentials).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        this.token = token;
        return from(Storage.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  register(data: {name, email, password, confirm_password, organisation, device_name, type}): Observable<any> {
    return this.http.post(`${SERVER_URL}/api/v2/register`, data).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        this.token = token;
        return from(Storage.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  start_reset(data: {email}): Observable<any> {
    return this.http.post(`${SERVER_URL}/api/v2/start_reset`, data)
  }
  complete_reset(data): Observable<any> {
    return this.http.post(`${SERVER_URL}/api/v2/complete_reset`, data).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        this.token = token;
        return from(Storage.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    this.router.navigateByUrl('/login', {replaceUrl:true});
    return Storage.remove({key: TOKEN_KEY});
  }

}
