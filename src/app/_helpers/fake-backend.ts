import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpEvent, HttpHandler, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

//array in localstorage for users
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor{
  intercept(request:HttpRequest<any>, next:HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    //wrap in server delayed api call
    return of(null)
    .pipe(mergeMap(handleRoute))
    .pipe(materialize())
    .pipe(delay(500)
    .pipe(dematerialize());

    function handleRoute(){
      switch(true){
        case url.endsWith('/users/authenticate') && method=== 'POST':
        return authenticate();
        break;
        case url.endsWith('/users/register') && method === 'POST':
        return register();
        break;
        case url.endsWith('/users') && method === 'GET':
        return getUsers();
        break;
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
        return deleteUser();
        break;
        default:
        return next.handle(request);
      }
    }

    //route functions
    function authenticate(){
      const { username, password } = body;
      const user = users.find( x => x.username === username && x.password === passowrd );
      if(!user) return error('Username or password is incorrect');
      return ok({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        token: 'fake-jwt-token',
      })
    }
    
  }
}