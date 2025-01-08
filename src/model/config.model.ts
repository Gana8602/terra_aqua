
export interface Config {
    id: number;
    unit: string;
    value: string;
    sensor_type: string;
    below_danger: string;
    above_danger: string;
    below_warning: string;
    above_warning: string;
    bins:String;
    e_bins:string;
  }

  export interface StationConfigs{
    station:string;
    danger_circle:number;
    geo_format: string;
    id: number;
    latitude_dd: number;
    latitude_deg: number;
    latitude_min: number;
    latitude_sec: number;
    longitude_dd: number;
    longitude_deg :number;
    longitude_min: number;
    longitude_sec: number;
    station_name: string;
    warning_circle:number;
  }
  


 export interface SensorData {
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
  export interface SensorData2 {
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

  export interface sensorLiveData{
    buoy1:SensorData[];
    buoy2:SensorData2[];
  }

  export interface CurrentUser{
    id: number,
    userName: string,
    name: string,
    email: string,
    role: string,
  }

  export interface images{
    image1:string,
    iamge2:string
  }