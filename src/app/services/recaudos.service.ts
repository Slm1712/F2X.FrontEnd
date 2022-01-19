import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecaudosService {
  private url = environment.baseUrl;
  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) {
  }
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8'
  });

  getRecaudos(): Observable<any> {
    return this.http.get(`${this.url}/getRecaudos/`);
  }
}
