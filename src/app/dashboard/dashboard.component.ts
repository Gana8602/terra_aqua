import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LayoutComponent } from '../layout/layout.component';
import { BatteryComponent } from '../battery/battery.component';
import { HealthComponent } from '../health/health.component';
import { GaugeComponent } from '../gauge/gauge.component';
import { number } from 'echarts';
import { fromLonLat } from 'ol/proj';
import { text } from 'node:stream/consumers';
import { SensorData, Config, SensorData2 } from '../../model/config.model';
import { ConfigDataService } from '../config-data.service';
import { HttpClientModule } from '@angular/common/http';
import { cos } from '@amcharts/amcharts4/.internal/core/utils/Math';
import { ActivatedRoute, Router } from '@angular/router';
import { parse } from 'path';


export interface e_bins{
  name:string,
  bin:string,
  show:boolean
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BatteryComponent, HealthComponent, GaugeComponent, HttpClientModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers:[ConfigDataService]
})
export class DashboardComponent {
  isBrowser: boolean;
  map!: any;  // Leaflet Map will be dynamically loaded only in the browser
  center: [number, number] = [14.602590765602967, 80.19146988481407];
  radius = 180;
  wrange = 80;
  compassvalue1: number = 170;
  compval1!:string;
  compassvalue2: number = 45;
  compval2!:string;
  compassvalue3: number = 163;
  compval3!:string;
  progressValue = 10;
  currentSpeed: number = 100;
  currentValue: number = 20;
  maxValue: number = 40;
  tide:number = 13;
  lat!:number;
  lang!:number;
  s_current:number =0;
  m_current:number =0;
  l_current:number = 0;
  s_current_d!:number;
  m_current_d!:number;
  l_current_d!:number;
  current_unit:string = '';
  battery: number = 10;
  message:string = 'range';
  below_warning:number = 12.2;
  configs:Config[]=[];
  tide_unit:string ='';
  time!:string;
  utc!:string;
  buoyImage!:string;
  showExpand:boolean = false;

  innerCurrent1!:number;
  innerCurrent2!:number;
  innerCurrent3!:number;
  innerCurrent4!:number;
  innerCurrent5!:number;
  innerCurrent6!:number;
  innerCurrent7!:number;

  innerdirection1!:number;
  innerdirection2!:number;
  innerdirection3!:number;
  innerdirection4!:number;
  innerdirection5!:number;
  innerdirection6!:number;
  innerdirection7!:number;
  inCompval1!:string;
  inCompval2!:string;
  inCompval3!:string;
  inCompval4!:string;
  inCompval5!:string;
  inCompval6!:string;
  inCompval7!:string;



dummyData1:SensorData[]=[
  {
    "Battery_Voltage": "12.4",
    "Date": "2025-01-08T00:00:00.000Z",
    "GPS_Date": "1970-01-01T00:00:00.000Z",
    "LAT": 12.90935942,
    "LONG": 77.59784407,
    "Lower_CurrentSpeedDirection": "0.32;254.7",
    "Middle_CurrentSpeedDirection": "0.71;249.3",
    "S1_RelativeWaterLevel": 2.37,
    "S2_SurfaceCurrentSpeedDirection":"0.69;221.6",
    "StationID":"CWPRS01",
    "Time":"1970-01-01T09:30:00.000Z",
    "UTC_Time":"1970-01-01T06:00:00.000Z",
    // "dateTime": "2025-01-08T05:06:54.943Z",
    "id":103,
    "profile4": "23.4;233.9",
    "profile5": "53.2;234.9",
    "profile6": "21.3;321.9",
    "profile7": "43.2;233.0",
    "profile8": "11.3;343.2",
    "profile9": "32.2;244.3",
    "profile10": "12.3;123.3"
  },
  {
    "Battery_Voltage": "12.4",
    "Date": "2025-01-08T00:00:00.000Z",
    "GPS_Date": "1970-01-01T00:00:00.000Z",
    "LAT": 12.90935942,
    "LONG": 77.59784407,
    "Lower_CurrentSpeedDirection": "0.32;254.7",
    "Middle_CurrentSpeedDirection": "0.71;249.3",
    "S1_RelativeWaterLevel": 2.37,
    "S2_SurfaceCurrentSpeedDirection":"0.69;221.6",
    "StationID":"CWPRS01",
    "Time":"1970-01-01T09:20:00.000Z",
    "UTC_Time":"1970-01-01T06:00:00.000Z",
    // "dateTime": "2025-01-08T05:06:54.943Z",
    "id":102,
    "profile4": "23.4;233.9",
    "profile5": "53.2;234.9",
    "profile6": "21.3;321.9",
    "profile7": "43.2;233.0",
    "profile8": "11.3;343.2",
    "profile9": "32.2;244.3",
    "profile10": "12.3;123.3"
  },
  {
    "Battery_Voltage": "12.4",
    "Date": "2025-01-08T00:00:00.000Z",
    "GPS_Date": "1970-01-01T00:00:00.000Z",
    "LAT": 12.90935942,
    "LONG": 77.59784407,
    "Lower_CurrentSpeedDirection": "0.32;254.7",
    "Middle_CurrentSpeedDirection": "0.71;249.3",
    "S1_RelativeWaterLevel": 2.37,
    "S2_SurfaceCurrentSpeedDirection":"0.69;221.6",
    "StationID":"CWPRS01",
    "Time":"1970-01-01T09:10:00.000Z",
    "UTC_Time":"1970-01-01T06:00:00.000Z",
    // "dateTime": "2025-01-08T05:06:54.943Z",
    "id":101,
    "profile4": "23.4;233.9",
    "profile5": "53.2;234.9",
    "profile6": "21.3;321.9",
    "profile7": "43.2;233.0",
    "profile8": "11.3;343.2",
    "profile9": "32.2;244.3",
    "profile10": "12.3;123.3"
  }
]


dummyData2:SensorData2[]=[
{
  "Battery_Voltage": "10.4",
  "Date":"2025-01-08T00:00:00.000Z",
  "GPS_Date":"1900-01-01T00:00:00.000Z",
  "LAT": 18.994803,
  "LONG": 72.80921,
  "Lower_CurrentSpeedDirection": "0.32;254.7",
  "Middle_CurrentSpeedDirection": "0.71;249.3",
  "S1_RelativeWaterLevel":2.37,
  "S2_SurfaceCurrentSpeedDirection": "0.69;221.6",
  "StationID":"CWPRS02",
  "Time": "1970-01-01T09:30:00.000Z",
  "UTC_Time": "1970-01-01T06:00:00.000Z",
  "id": 63,
  "profile4": "23.4;233.9",
  "profile5": "53.2;234.9",
  "profile6": "21.3;321.9",
  "profile7": "43.2;233.0",
  "profile8": "11.3;343.2",
  "profile9": "32.2;244.3",
  "profile10":"12.3;123.3"
},
{
  "Battery_Voltage": "10.4",
  "Date":"2025-01-08T00:00:00.000Z",
  "GPS_Date":"1900-01-01T00:00:00.000Z",
  "LAT": 18.994803,
  "LONG": 72.80921,
  "Lower_CurrentSpeedDirection": "0.32;254.7",
  "Middle_CurrentSpeedDirection": "0.71;249.3",
  "S1_RelativeWaterLevel":2.37,
  "S2_SurfaceCurrentSpeedDirection": "0.69;221.6",
  "StationID":"CWPRS02",
  "Time": "1970-01-01T09:20:00.000Z",
  "UTC_Time": "1970-01-01T06:00:00.000Z",
  "id": 62,
  "profile4": "23.4;233.9",
  "profile5": "53.2;234.9",
  "profile6": "21.3;321.9",
  "profile7": "43.2;233.0",
  "profile8": "11.3;343.2",
  "profile9": "32.2;244.3",
  "profile10":"12.3;123.3"
},
{
  "Battery_Voltage": "10.4",
  "Date":"2025-01-08T00:00:00.000Z",
  "GPS_Date":"1900-01-01T00:00:00.000Z",
  "LAT": 18.994803,
  "LONG": 72.80921,
  "Lower_CurrentSpeedDirection": "0.32;254.7",
  "Middle_CurrentSpeedDirection": "0.71;249.3",
  "S1_RelativeWaterLevel":2.37,
  "S2_SurfaceCurrentSpeedDirection": "0.69;221.6",
  "StationID":"CWPRS02",
  "Time": "1970-01-01T09:10:00.000Z",
  "UTC_Time": "1970-01-01T06:00:00.000Z",
  "id": 61,
  "profile4": "23.4;233.9",
  "profile5": "53.2;234.9",
  "profile6": "21.3;321.9",
  "profile7": "43.2;233.0",
  "profile8": "11.3;343.2",
  "profile9": "32.2;244.3",
  "profile10":"12.3;123.3"
}
]
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private layout: LayoutComponent,
    private cdr: ChangeDetectorRef,
    private route:ActivatedRoute,
    private data:ConfigDataService
  ) {
    // Check if the code is running in the browser
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log("browser", this.isBrowser)
  }

  sensor:Config[]=[];
ngOnInit(): void {

  // this.route.paramMap.subscribe(params => {
  //   this.layout.page = params.get('page') || 'home';
  // });
  // this.assign();
  this.data.getsensorConfigs().subscribe((sensor) => {
    this.sensor = sensor;
    // console.log("Sensors==", this.sensor);
    if (this.sensor != null) {
      this.assign();
    }
  });
}
  // Initialize map only after view has been fully rendered
  ngAfterViewInit(): void {
    this.assign()
    
    
   
    
  }
  sensorDatelist:SensorData[]=[];
  
updates(value:string, data:string):number{
  let val!:number;
  console.log("value", value);
  if(data == "speed"){
    switch (value.trim()) {
      case "Profile1":
        return val = parseFloat(this.sensorDatelist[0].S2_SurfaceCurrentSpeedDirection.split(';')[0]);
      case "Profile2":
        return val = parseFloat(this.sensorDatelist[0].Middle_CurrentSpeedDirection.split(';')[0]);
      case "Profile3":
        return val = parseFloat(this.sensorDatelist[0].Lower_CurrentSpeedDirection.split(';')[0]);
      case "Profile4":
        return val = parseFloat(this.sensorDatelist[0].profile4.split(';')[0]);
      case "Profile5":
        return val = parseFloat(this.sensorDatelist[0].profile5.split(';')[0]);
      case "Profile6":
          return val = parseFloat(this.sensorDatelist[0].profile6.split(';')[0]);
      case "Profile7":
          return val = parseFloat(this.sensorDatelist[0].profile7.split(';')[0]);
      case "Profile8":
          return val = parseFloat(this.sensorDatelist[0].profile8.split(';')[0]);
      case "Profile9":
          return val = parseFloat(this.sensorDatelist[0].profile9.split(';')[0]);
      case "Profile10":
          return val = parseFloat(this.sensorDatelist[0].profile10.split(';')[0]);
          
      default:
        return NaN
  }
    
  }else if(data == 'direction'){
    switch (value.trim()) {
      case "Profile1":
        return val = parseFloat(this.sensorDatelist[0].S2_SurfaceCurrentSpeedDirection.split(';')[1]);
      case "Profile2":
        return val = parseFloat(this.sensorDatelist[0].Middle_CurrentSpeedDirection.split(';')[1]);
      case "Profile3":
        return val = parseFloat(this.sensorDatelist[0].Lower_CurrentSpeedDirection.split(';')[1]);
      case "Profile4":
        return val = parseFloat(this.sensorDatelist[0].profile4.split(';')[1]);
      case "Profile5":
        return val = parseFloat(this.sensorDatelist[0].profile5.split(';')[1]);
      case "Profile6":
          return val = parseFloat(this.sensorDatelist[0].profile6.split(';')[1]);
      case "Profile7":
          return val = parseFloat(this.sensorDatelist[0].profile7.split(';')[1]);
      case "Profile8":
          return val = parseFloat(this.sensorDatelist[0].profile8.split(';')[1]);
      case "Profile9":
          return val = parseFloat(this.sensorDatelist[0].profile9.split(';')[1]);
      case "Profile10":
          return val = parseFloat(this.sensorDatelist[0].profile10.split(';')[1]);
          
      default:
        return NaN
  }
  }
  return val;

}
   calculateResult(existingData: number, newData: string | number): number {
    // Check if newData is a number without any signs
    if (typeof newData === 'number') {
      return existingData + newData;
    }
    // If newData is a string, check for "+" or "-" sign
    if (typeof newData === 'string') {
      if (newData.startsWith('-')) {
        return existingData - parseFloat(newData); // Subtract if it has "-"
      } else if (newData.startsWith('+')) {
        return existingData + parseFloat(newData); // Add if it has "+"
      } else {
        return existingData + parseFloat(newData); // No sign means add
      }
    }
  
    // In case of an unexpected input, return the existingData
    return existingData;
  }
  assign(){
    // console.log()
    const date = new Date();
    const todayDate = date.toISOString().substr(0, 10);
     this.tide_unit = this.layout.configs[0].unit;
    this.data.getSensorLiveData(todayDate, todayDate).subscribe(datat=>{

       if(this.layout.selectedBuoy == 'CWPRS01'){
        if(datat.buoy1.length !==4){
          console.log("yes low");
          this.sensorDatelist = this.dummyData1;
        }else{
          this.sensorDatelist = datat.buoy1;
        }
        
        console.log(this.sensorDatelist[0]);
        this.buoyImage = this.layout.image1;
         if(this.buoyImage !=null){
          this.fetch();
        }
       
        
      }else if(this.layout.selectedBuoy == 'CWPRS02'){
        if(datat.buoy2.length !==4){
          console.log("yes low");
          this.sensorDatelist = this.dummyData2;
        }else{
          this.sensorDatelist = datat.buoy2;
        }
        // this.sensorDatelist = datat.buoy2;
        console.log(this.sensorDatelist[0])
        this.buoyImage = this.layout.image2;
        console.log(this.buoyImage);
        if(this.buoyImage !=null){
          console.log("oookkk")
          this.fetch();
        }
        
      }
      
      
    },
  (error) => {
    console.error('Error fetching sensor data:', error);
  });

  } 
  format(date:string, time:string):string{
    const d = new Date(date);
    const dd = d.toISOString().substr(0, 10);
   const  formattedDate = dd;
 
   const t = new Date(time);
   const tt = t.toISOString().substr(11,8);
   const formattedtime = tt;
    return `${formattedDate} ${formattedtime}`;

  }
  list:string[]= ['Profile1', 'Profile2', 'Profile3', 'Profile4', 'Profile5', 'Profile6', 'Profile7', 'Profile8', 'Profile9', 'Profile10'];
filteredBinsNames:string[] =[]; 
binss:string[]=[];
  fetch(){

    const num = this.calculateResult(this.sensorDatelist[1].S1_RelativeWaterLevel, this.layout.configs[0].value);
     if(this.sensorDatelist[0].S1_RelativeWaterLevel !=null){
      this.tide= this.calculateResult(this.sensorDatelist[0].S1_RelativeWaterLevel, this.layout.configs[0].value);
    }else{
      this.tide= this.calculateResult(this.sensorDatelist[1].S1_RelativeWaterLevel, this.layout.configs[0].value);
    }
    this.battery = parseFloat(this.sensorDatelist[0].Battery_Voltage);
   
    // this.sensorDatelist=this.layout.sensorDataList;
     this.time = 
    this.format(this.sensorDatelist[0].Date, this.sensorDatelist[0].Time);
    this.utc = this.format(this.sensorDatelist[0].UTC_Time, this.sensorDatelist[0].UTC_Time);
    // this.tide= this.sensorDatelist[0].S1_RelativeWaterLevel;
    this.lat = this.sensorDatelist[0].LAT;
    this.lang = this.sensorDatelist[0].LONG;
    this.center = [this.lat, this.lang];
    // console.log("lat",this.center)
    const bin = this.sensor[1].bins;
    const bins = bin.split(',');

    console.log(bins, this.sensorDatelist[0].profile4)
    this.binss = bins
    const filteredList = this.list.filter(item => !bins[0].includes(item.trim()) && !bins[1].includes(item.trim()) && !bins[2].includes(item.trim()));
    // const filteredList2 = this.list.filter(item => !bins[1].includes(item.trim()));
    const ff = filteredList[0];
    console.log("finterled", filteredList, ff);
    // this.filteredBinsNames = filteredList;
    
    this.s_current = this.updates(bins[0], 'speed');
    this.m_current = this.updates(bins[1], 'speed');
    this.l_current =this.updates(bins[2], 'speed');
    
    console.log("currents_inner ",this.innerCurrent1,this.innerCurrent2, this.innerCurrent3, this.innerCurrent4, this.innerCurrent5, this.innerCurrent6, this.innerCurrent7, )
    console.log(this.innerCurrent1, this.innerdirection1);
    this.cdr.detectChanges();
    this.compassvalue1 = this.updates(this.binss[0], 'direction');
    this.compval1= this.direction(this.compassvalue1);
    this.compassvalue2 = this.updates(bins[1], 'direction');
    this.compval2= this.direction(this.compassvalue2);
    this.compassvalue3 = this.updates(bins[2], 'direction');
    this.compval3= this.direction(this.compassvalue3);
    // if (this.isBrowser) {
      console.log("is browser true")
      this.loadLeafletAndInitializeMap();
    // }else{
      console.log("is browser false")
    // }
  }
  direction(degrees: number): string {
    // Normalize degrees to be between 0 and 360
    degrees = degrees % 360;
    if (degrees < 0) degrees += 360;
  
    // Determine the direction based on degree ranges
    if (degrees >= 348.75 || degrees < 11.25) {
      return 'N';   // North
    } else if (degrees >= 11.25 && degrees < 33.75) {
      return 'NNE'; // North-Northeast
    } else if (degrees >= 33.75 && degrees < 56.25) {
      return 'NE';  // Northeast
    } else if (degrees >= 56.25 && degrees < 78.75) {
      return 'ENE'; // East-Northeast
    } else if (degrees >= 78.75 && degrees < 101.25) {
      return 'E';   // East
    } else if (degrees >= 101.25 && degrees < 123.75) {
      return 'ESE'; // East-Southeast
    } else if (degrees >= 123.75 && degrees < 146.25) {
      return 'SE';  // Southeast
    } else if (degrees >= 146.25 && degrees < 168.75) {
      return 'SSE'; // South-Southeast
    } else if (degrees >= 168.75 && degrees < 191.25) {
      return 'S';   // South
    } else if (degrees >= 191.25 && degrees < 213.75) {
      return 'SSW'; // South-Southwest
    } else if (degrees >= 213.75 && degrees < 236.25) {
      return 'SW';  // Southwest
    } else if (degrees >= 236.25 && degrees < 258.75) {
      return 'WSW'; // West-Southwest
    } else if (degrees >= 258.75 && degrees < 281.25) {
      return 'W';   // West
    } else if (degrees >= 281.25 && degrees < 303.75) {
      return 'WNW'; // West-Northwest
    } else if (degrees >= 303.75 && degrees < 326.25) {
      return 'NW';  // Northwest
    } else {
      return 'NNW'; // North-Northwest
    }
  }
  async loadLeafletAndInitializeMap(): Promise<void> {
    console.log("map location",this.center);
    const L = await import('leaflet');  // Lazy-load Leaflet
    this.initializeLeafletMap(L);
  }

  initializeLeafletMap(L: any): void {
    const mapContainer = document.getElementById('leaflet-map');
    
    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }

    this.map = L.map('leaflet-map').setView(this.center, 15);

    L.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=c30d4b0044414082b818c93c793707a4', {
      maxZoom: 18
    }).addTo(this.map);

    const markerIcon = L.icon({
      iconUrl: this.buoyImage!,
      name:'Buoy 1',
      
      iconSize: [24, 24], // Set the size of the marker
    });

    const marker = L.marker(this.center, { icon: markerIcon }).bindTooltip(this.layout.selectedBuoy, {
      permanent: true,
      offset: [0, 20],
       // To make the tooltip always visible
      direction: 'bottom', // Tooltip position relative to marker
    }).addTo(this.map);

    const circle = L.circle(this.center, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.1,
      radius: this.radius
    }).addTo(this.map);

    const warningCircle = L.circle(this.center, {
      color: 'yellow',
      fillColor: '#ff0',
      fillOpacity: 0.1,
      radius: this.wrange
    }).addTo(this.map);

    setTimeout(() => {
      const newCoords = this.center; // Simulate new position
      marker.setLatLng(newCoords);
      this.checkBuoyRange(newCoords, L);
      this.checkBuoyRange2(newCoords, L);
    }, 3000);
  }

  // Function to check if the marker is within the range
  checkBuoyRange(markerCoords: [number, number], L: any): void {
    const distance = this.map.distance(this.center, markerCoords);
    if (distance > this.radius) {
     } else {
      this.message = 'range';
     }
  }

  checkBuoyRange2(markerCoords: [number, number], L: any): void {
    const distance = this.map.distance(this.center, markerCoords);
    if (distance > this.wrange) {
       this.message = 'warning';
    } else if (distance > this.radius) {
       this.message = 'warning';
    }else{
      this.message = 'range';
     }
  }

 expandTap(action: string): void {
  if (action === 'expand') {
    if (this.extraBinAssign()) {
      this.showExpand = true;
      this.map?.setTarget(undefined); // Detach map
      this.map = undefined;
    }
  } else if (action === 'close') {
    this.showExpand = false;

    this.loadLeafletAndInitializeMap(); // Reinitialize map
    this.innerCurrent1 = 0;
    this.innerdirection1 =0;
  }
}

  e_bin1_name!:string;
  e_bin2_name!:string;
  e_bin3_name!:string;
  e_bin4_name!:string;
  e_bin5_name!:string;
  e_bin6_name!:string;
  e_bin7_name!:string;

  e_bin1_status:boolean = false;
  e_bin2_status:boolean = false;
  e_bin3_status:boolean = false;
  e_bin4_status:boolean = false;
  e_bin5_status:boolean = false;
  e_bin6_status:boolean = false;
  e_bin7_status:boolean = false;


  e_bins:e_bins[]=[];
  extraBinAssign():boolean{
    
   const bstring = this.sensor[1].e_bins;
   const bjson = JSON.parse(bstring);
    this.e_bins = bjson;
    for(let bin of this.e_bins){
      this.filteredBinsNames.push(bin.bin);
    }

    console.log("filteredBinsNames", this.e_bins);


    this.innerCurrent1 = this.updates(this.filteredBinsNames[0], 'speed');
    this.innerCurrent2 = this.updates(this.filteredBinsNames[1], 'speed');
    this.innerCurrent3 = this.updates(this.filteredBinsNames[2], 'speed');
    this.innerCurrent4 = this.updates(this.filteredBinsNames[3], 'speed');
    this.innerCurrent5 = this.updates(this.filteredBinsNames[4], 'speed');
    this.innerCurrent6 = this.updates(this.filteredBinsNames[5], 'speed');
    this.innerCurrent7 = this.updates(this.filteredBinsNames[6], 'speed');
    this.innerdirection1 = this.updates(this.filteredBinsNames[0], 'direction');
    this.innerdirection2 = this.updates(this.filteredBinsNames[1], 'direction');
    this.innerdirection3 = this.updates(this.filteredBinsNames[2], 'direction');
    this.innerdirection4 = this.updates(this.filteredBinsNames[3], 'direction');
    this.innerdirection5 = this.updates(this.filteredBinsNames[4], 'direction');
    this.innerdirection6 = this.updates(this.filteredBinsNames[5], 'direction');
    this.innerdirection7 = this.updates(this.filteredBinsNames[6], 'direction');
    this.inCompval1 = this.direction(this.innerdirection1);
    this.inCompval2 = this.direction(this.innerdirection2);
    this.inCompval3 = this.direction(this.innerdirection3);
    this.inCompval4 = this.direction(this.innerdirection4);
    this.inCompval5 = this.direction(this.innerdirection5);
    this.inCompval6 = this.direction(this.innerdirection6);
    this.inCompval7 = this.direction(this.innerdirection7);

    this.e_bin1_name = this.e_bins[0].name;
    this.e_bin2_name = this.e_bins[1].name;
    this.e_bin3_name = this.e_bins[2].name;
    this.e_bin4_name = this.e_bins[3].name;
    this.e_bin5_name = this.e_bins[4].name;
    this.e_bin6_name = this.e_bins[5].name;
    this.e_bin7_name = this.e_bins[6].name;

    this.e_bin1_status = this.e_bins[0].show;
    this.e_bin2_status = this.e_bins[1].show;
    this.e_bin3_status = this.e_bins[2].show;
    this.e_bin4_status = this.e_bins[3].show;
    this.e_bin5_status = this.e_bins[4].show;
    this.e_bin6_status = this.e_bins[5].show;
    this.e_bin7_status = this.e_bins[6].show;
    
    return !this.innerCurrent1 && !this.innerCurrent2 && !this.innerCurrent3 && !this.innerCurrent4
    && !this.innerCurrent5 && !this.innerCurrent6 && !this.innerCurrent7
    && !this.inCompval1 && !this.inCompval2 && !this.inCompval3
    && !this.inCompval4 && !this.inCompval5 && !this.inCompval6
    && !this.inCompval7
    && !this.innerdirection1
    && !this.innerdirection2
    && !this.innerdirection3
    && !this.innerdirection4
    && !this.innerdirection5
    && !this.innerdirection6
    && !this.innerdirection7 ? false : true;
    
  }
}
