import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { error } from 'console';

export interface BuoyData {
  id:number;
  StationID: string;
  Date: string;
  Time: string;
  UTC_Time:string;
  LAT: number;
  LONG: number;
  Battery_Voltage: string;
  GPS_Date: string;
  Lower_CurrentSpeedDirection:string;
  Middle_CurrentSpeedDirection:string;
  S1_RelativeWaterLevel:number;
  S2_SurfaceCurrentSpeedDirection:string;
  profile4:string;
  profile5:string;
  profile6:string;
  profile7:string;
  profile8:string;
  profile9:string;
  profile10:string;
}

export interface buoys {
  buoy1: BuoyData[];
  buoy2: BuoyData[];
}
@Injectable({
  providedIn: 'root',
})
export class StationService {
  private apiUrl = 'http://localhost:3000/api/users/sensorData';
private apiUrlrr = 'http://localhost:3000/api/users/getSensorsTime';


  constructor(private http: HttpClient) {}

  getStations(fromDate: string, toDate: string): Observable<buoys> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http.get<buoys>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching stations:', error);
        return throwError(() => new Error('Failed to fetch stations.'));
      })
    );
  }
  getSensorssTime(fromDate: string, toDate: string): Observable<buoys> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http.get<buoys>(this.apiUrlrr, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching stations:', error);
        return throwError(() => new Error('Failed to fetch stations.'));
      })
    );
  }
}
