import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http:Http) { }

  // use the backend api to register a user 
  registerUser(user) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      // this is an 'observable'
      // we make a post request to register
      return this.http.post('/users/register', user,{headers: headers})
          .map(res => res.json());
  }

  authenticateUser(user) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      // this is an 'observable' 
      // we make a post request to authenticate
      return this.http.post('/users/authenticate', user,{headers: headers})
          .map(res => res.json());
  }

  // this is a get request (not post) so we do not send it the second parameter (user)
  getProfile() {
      let headers = new Headers();
      this.loadToken();
      headers.append('Authorization', this.authToken);
      headers.append('Content-Type', 'application/json');
      return this.http.get('/users/profile', {headers: headers})
          .map(res => res.json());

  }

  storeUserData(token, user) {
    localStorage.setItem('id_token',token);
    // local stroage can only have strings so we change the JSON object to a string before storing, when we pull it out we'll convert it back to a user object
    localStorage.setItem('user', JSON.stringify(user)); 
    this.authToken = token;
    this.user= user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    //console.log("FA checking auth service loggedIn");
    return tokenNotExpired('id_token');
  }

  logout(){
    console.log('FA Logging out');
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
