import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Config,
  CurrentUser,
  images,
  SensorData,
  sensorLiveData,
  StationConfigs,
} from '../model/config.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigDataService {
  CurrentUser!: CurrentUser;
  images!: images;

  private apiUrl = 'http://localhost:3000/api/';
  constructor(private http: HttpClient) {}
  getStationNames(): Observable<StationConfigs[]> {
    return this.http.get<StationConfigs[]>(`${this.apiUrl}getstationconfig`); // Adjust the endpoint
  }

  // http://localhost:3000/api/getconfigs
  getsensorConfigs(): Observable<Config[]> {
    return this.http.get<Config[]>(`${this.apiUrl}getconfigs`);
  }

  getSensorLiveData(
    fromDate: string,
    toDate: string
  ): Observable<sensorLiveData> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);
    return this.http.get<sensorLiveData>(`${this.apiUrl}users/sensorData`, {
      params,
    });
  }

  AddLog(logData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}addlog`, logData);
  }

  login(cred: any): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(`${this.apiUrl}users/login`, cred);
  }
}
