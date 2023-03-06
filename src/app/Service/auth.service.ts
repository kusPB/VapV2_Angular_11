import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../modules/shell/services/notification.service';

//const API_URL = 'http://87.106.157.215:2000/';
const API_URL = environment.API_URL;
const HTTP_OPTIONS = {
    headers: new HttpHeaders()
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('APIKey', 'AccuritaAPIKey987654321')
        .set('Access-Control-Allow-Origin', '*')
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    redirectUrl = '';

    private static handleError(error: HttpErrorResponse): any {
        if (error.error instanceof ErrorEvent) {
            //alert('An error occurred:'+ error.error.message);
            //console.error('An error occurred:', error.error.message);
        } else {
            // console.error(
            //     `Backend returned code ${error.status}, ` +
            //     `body was: ${error.error}`);
            //alert(`Backend returned code ${error.status}, body was: ${error.error}`);

        }
        return throwError(
            alert('Authentication error occurred, IP not White Listed or Incorrect Username/Password')
        );
    }

    constructor(private http: HttpClient, private tokenService: TokenService) {
    }

    login(loginData: any): Observable<any> {
        this.tokenService.removeToken();
        this.tokenService.removeRefreshToken();
        const body = new HttpParams()
            .set('username', loginData.UserName)
            .set('password', loginData.Password)
            .set('grant_type', 'password');
        return this.http.post<any>(API_URL + 'token', body, HTTP_OPTIONS)
            .pipe(
                
                tap(res => {

                    this.tokenService.saveToken(res.access_token);
                    this.tokenService.saveRefreshToken(res.access_token);
                }),
                catchError(AuthService.handleError)
            );
    }

    refreshToken(refreshData: any): Observable<any> {
        this.tokenService.removeToken();
        this.tokenService.removeRefreshToken();
        const body = new HttpParams()
            .set('refresh_token', refreshData.access_token)
            .set('grant_type', 'refresh_token');
        return this.http.post<any>(API_URL + 'token', body, HTTP_OPTIONS)
            .pipe(
                tap(res => {
                    this.tokenService.saveToken(res.access_token);
                    this.tokenService.saveRefreshToken(res.access_token);
                }),
                catchError(AuthService.handleError)
            );
    }
    logout(): void {
        this.tokenService.removeToken();
    }
}
