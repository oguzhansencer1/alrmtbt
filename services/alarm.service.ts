import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Alarm {
  id: number;
  name: string;
  faultReason: string;
  faultDetail: string;
  faultTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlarmService {
  private apiUrl = 'https://localhost:7221/api/Alarm';

  constructor(private http: HttpClient) {}

  getAlarms(): Observable<Alarm[]> {
    return this.http.get<Alarm[]>(this.apiUrl);
  }
}
