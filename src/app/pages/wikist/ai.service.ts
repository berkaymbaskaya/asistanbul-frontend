import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  constructor(private http: HttpClient) {}
  getInfo(name: string) {
    return this.http.get('http://localhost:1923/createImage?mesaj=' + name);
  }
}
