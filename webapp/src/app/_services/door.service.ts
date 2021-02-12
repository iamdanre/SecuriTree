import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class DoorService {

  constructor(private http: HttpClient) { }
  getAll(): Observable<any> {
    return this.http.get(API_URL + 'doors');
  }
  lock(id: string): Promise<any> {
    let data = { "status": "closed" };
    return this.http.put(`${API_URL}door/${id}`, data).toPromise();
  }
  unlock(id: string): Promise<any> {
    let data = { "status": "open" };
    return this.http.put(`${API_URL}door/${id}`, data).toPromise();
  }
}
