import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { World, Pallier, Product } from './world';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {
  server = "http://localhost:8080/";
  user = localStorage.getItem("username") || 'Captain' + Math.floor(Math.random() * 10000);
  constructor(private http: HttpClient) { }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  getWorld(): Promise<World> {
    return this.http.get(this.server + "adventureisis/generic/world", { headers: this.setHeaders(this.user) })
      .toPromise().catch(this.handleError);
  };

  putManager(manager: Pallier): Promise<Pallier> {
    return this.http.put(this.server + "adventureisis/generic/manager", manager, { headers: this.setHeaders(this.user) })
      .toPromise().catch(this.handleError);
  };

  putProduct(product: Product): Promise<Product> {
    return this.http.put(this.server + "adventureisis/generic/product", product, { headers: this.setHeaders(this.user) })
      .toPromise().catch(this.handleError);
  };

  get getServer() {
    return this.server;
  };
  get getUser() {
    return this.user;
  };
  set setUser(user: string) {
    this.user = user;
  };
  private setHeaders(user: string): HttpHeaders {
    var headers = new HttpHeaders({ 'X-User': user });
    return headers;
  };
}