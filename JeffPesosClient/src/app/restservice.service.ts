import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { World, Pallier, Product } from './world';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {
  server = "http://localhost:8080/";
  user = "";
  constructor(private http: HttpClient) { }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
   getWorld(): Promise<World> {
    return this.http.get(this.server + "adventureisis/generic/world")
    .toPromise().catch(this.handleError);
  };
  get getServer(){
     return this.server;
   };
  get getUser(){
    return this.user;
  };
  set setUser(user: string)  {
    this.user = user;
  };
}