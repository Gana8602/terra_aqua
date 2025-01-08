import { Component, OnInit, Renderer2 } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import Map from 'ol/Map';
import View from 'ol/View';
import { Circle as CircleStyle, Fill, Text, Stroke, Style, Icon } from 'ol/style';
import { Feature } from 'ol';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
// import { PointerEvent } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Point, Circle, LineString } from 'ol/geom';
import { LayoutComponent } from '../layout/layout.component';
import { getDistance, offset } from 'ol/sphere';
import { SensorData, StationConfigs, SensorData2, images } from '../../model/config.model';
import { ConfigDataService } from '../config-data.service';
import { HttpClientModule } from '@angular/common/http';
import { config } from 'process';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidenavComponent, HttpClientModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[ConfigDataService]
})
export class HomeComponent implements OnInit {
  popupVisible = false;
  popupContent = '';
  popupPosition: [number, number] = [0, 0];
  map!: Map;
  center:[number, number] = fromLonLat([80.197876, 14.589438]) as [number, number];
  buoy2:[number, number] = fromLonLat([80.178118, 14.607975]) as [number, number];
  radius = 180;
  wrange = 80;
  bouy1wrange!:number;
  buoy2wrange!:number;
  buoy1danger!:number;
  buoy2danger!:number;
  vectorLayer!: VectorLayer;
  currentLayer!: TileLayer;
  showPaths:boolean = false;
  stationCOnfig: StationConfigs[]=[];
  sensorsliveData:SensorData[]=[];
  sensorsliveData2:SensorData2[]=[];
  stationName1!:string;
  stationName2!:string;
  livelocationbuoy1!:[number,  number];
  livelocationbuoy2!:[number,  number];
  selectedBuoy!:string;
  trackpath1:[number, number][]=[this.center];
  trackpath2:[number, number][]=[this.buoy2];
  showTrackPath: boolean = false;
  imageMarker1!:string;
  imageMarker2!:string;

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
  "Battery_Voltage": "12.4",
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
  "Battery_Voltage": "12.4",
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
  "Battery_Voltage": "12.4",
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
 
  mapUrl = 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
mapChange(name:String){
  
  switch (name) {
    case 'OpenCycleMap':
      this.mapUrl = 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
     
      break;
      case 'Transport':
        this.mapUrl = 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}';
        break;
        case 'Landscape':
          this.mapUrl = 'http://mt0.google.com/vt/lyrs=r&hl=en&x={x}&y={y}&z={z}';
          break;
          case 'Outdoors':
            this.mapUrl = 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}';
            break;
            case 'TransportDark':
              this.mapUrl = 'http://mt0.google.com/vt/lyrs=t&hl=en&x={x}&y={y}&z={z}';
              break;
              case 'Spinal Map':
                this.mapUrl = 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}';
                break;
      
    default:
      this.mapUrl = 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      break;
  }
this.updateMapLayer();
}
updateMapLayer() {
  const tileLayer = this.map.getLayers().getArray().find(layer => layer instanceof TileLayer) as TileLayer;
  if (tileLayer) {
    const newSource = new XYZ({
      url: this.mapUrl,
    });
    tileLayer.setSource(newSource);
  }
}
online:boolean = false;

ngOnInit(): void {
  const status = navigator.onLine;
  this.online = status;
  if(!this.online){
    this.mapUrl = '../../../../assets/tiles/western/{z}/{x}/{y}.png';
  }
  console.log("online status",status);
  const date = new Date();
  const todayDate = date.toISOString().substr(0, 10);
 
  if(todayDate !=null){
    forkJoin([
      this.data.getSensorLiveData(todayDate, todayDate),
      this.data.getStationNames()
    ]).subscribe(([sensors, configs]) => {
      if(sensors.buoy1.length !== 4){
        console.log("yes its low data");
        this.sensorsliveData =this.dummyData1;
        this.sensorsliveData2 = this.dummyData2;
      }else{
        this.sensorsliveData = sensors.buoy1;
       
       this.sensorsliveData2 = sensors.buoy2;
      }
      console.log("bin4:", this.sensorsliveData);
  console.log("sensor Data",this.sensorsliveData2);
      this.livelocationbuoy1 = fromLonLat([this.sensorsliveData[0].LONG, this.sensorsliveData[0].LAT]) as [number, number];
      this.livelocationbuoy2 = fromLonLat([this.sensorsliveData2[0].LONG, this.sensorsliveData2[0].LAT]) as [number, number];
      // this.buoy2 = fromLonLat([configs[1].longitude_dd ,configs[1].latitude_dd]) as [number, number];
       this.bouy1wrange = configs[0].warning_circle;
      this.buoy2wrange = configs[1].warning_circle;
      this.buoy1danger = configs[0].danger_circle;
      this.buoy2danger = configs[1].danger_circle;
       const status = this.coordassign(configs);
      const StatusCheck1 = this.isWithin20Minutes(this.sensorsliveData[0].Date, this.sensorsliveData[0].Time);
      const statusCheck2 = this.isWithin20Minutes(this.sensorsliveData2[0].Date, this.sensorsliveData2[0].Time);
      this.imageMarker1 = StatusCheck1 ? '../../assets/buoy.png' : '../../assets/buoy_offline.png';
      this.imageMarker2 = statusCheck2 ? '../../assets/buoy.png' : '../../assets/buoy_offline.png';
      this.layout.image1 = this.imageMarker1;
      this.layout.image2 = this.imageMarker2;
      console.log(this.layout.image1, this.layout.image2);
      
 
      if(this.imageMarker1 != null && this.imageMarker2 !=null){
  if (status && !this.map) {
        
  console.log("ok");
        this.MapInit();
      }
      }
      
    });
  }
  
}




coordassign(configs: StationConfigs[]): boolean {
  // Ensure there are at least two configurations in the array to avoid errors
  if (configs.length < 2) {
    console.error("Insufficient station configurations provided.");
    return false;
  }

  // Assign station names
  this.stationName1 = configs[0].station_name;
  this.stationName2 = configs[1].station_name;

  // Function to convert DMS to Decimal Degrees
  const convertDMSToDD = (deg: number, min: number, sec: number): number => {
    return deg + (min / 60) + (sec / 3600);
  };

  // Helper function to assign locations based on geo_format
  const assignLocation = (config: StationConfigs): [number, number] => {
    if (config.geo_format === "DMS") {
      return fromLonLat([
        convertDMSToDD(config.longitude_deg, config.longitude_min, config.longitude_sec),
        convertDMSToDD(config.latitude_deg, config.latitude_min, config.latitude_sec)
      ]) as [number, number];
    } else if (config.geo_format === "DD") {
      return fromLonLat([
        config.longitude_dd,
        config.latitude_dd
      ]) as [number, number];
    } else {
      console.error("Unknown geo_format encountered:", config.geo_format);
      return [0, 0]; // Return a default value or handle as needed
    }
  };

  // Assign buoy locations
  this.center = assignLocation(configs[0]);
  this.buoy2 = assignLocation(configs[1]);

  // Log buoy locations for debugging
 

  // If all went well, return true
  return true;
}


isWithin20Minutes(dateTimeString: string, timeString: string): boolean {
  // Extract date and time parts from the provided ISO strings
  const date = new Date(dateTimeString).toISOString().split("T")[0];
  const timee = new Date(timeString);
  const time = timee.toISOString().substr(11, 8);

  // Combine date and time into a single string without "Z" to use local time
  const combinedDateTime = new Date(`${date}T${time}`);

  // Get the current date and time
  const currentDateTime = new Date();
 

  // Calculate the difference in milliseconds
  const diffInMs = currentDateTime.getTime() - combinedDateTime.getTime();
   // Convert the difference to minutes
  const diffInMinutes = diffInMs / (1000 * 60);

  // Check if the difference is within 20 minutes
  return diffInMinutes <= 25;
}




  constructor(private layout: LayoutComponent, private data:ConfigDataService, private router: Router) {}
  


  
  MapInit(): void {
    
    // this.assign();
    // if(status){
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const vectorSource = new VectorSource();
        
        this.vectorLayer = new VectorLayer({
          source: vectorSource,
        });
        
        this.createMarker(this.livelocationbuoy1, this.stationName1, vectorSource, this.imageMarker1);
        this.createMarker(this.livelocationbuoy2, this.stationName2, vectorSource, this.imageMarker2);
        this.createCircle(this.center, this.buoy1danger, 'red', vectorSource);
        this.createCircle(this.buoy2, this.buoy2danger, 'red', vectorSource);
        this.createCircle(this.center, this.bouy1wrange, 'yellow', vectorSource);
        this.createCircle(this.buoy2, this.buoy2wrange, 'yellow', vectorSource);
       
        this.map = new Map({
          view: new View({
            center: this.buoy2,
            zoom: this.online? 16 :11,
            

          }),
          layers: [
            new TileLayer({
              source: new XYZ({
                url:this.mapUrl,
              }),
            }),
            this.vectorLayer,
          ],
          target: 'ol-map',
        });
  
        this.map.on('click', (event) => {
          this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
            if (feature instanceof Feature) {
              const name = feature.get('name');
              if (name) {
                // this.router.navigate(['/base', `Dashboard_${name}`]);
                this.layout.selectedBuoy = name;
                // this.layout.sensors();
                //  this.router.navigate(['/base', `Dashboard_${name}`]);
                this.layout.page = 'Dashboard';
               
                
                
                
                
              }
            }
          });
        });
        this.map.getViewport().addEventListener('pointermove', (event) => {
          const pixel = this.map.getEventPixel(event);
        
          // Reset cursor by default
          this.map.getTargetElement().style.cursor = '';
        
          // Check if a feature exists at the pixel where the pointer is hovering
          this.map.forEachFeatureAtPixel(pixel, (feature) => {
            if (feature instanceof Feature && feature.get('name')) { // 'name' or any unique property of marker
              this.map.getTargetElement().style.cursor = 'pointer';
            }
          });
        });
        
   
      }
    }, 2);
      
  // }
    
  }
 

  createMarker(coordinate: [number, number], name: string, vectorSource: VectorSource, img:string) {
    const markerStyle = new Style({
      image: new Icon({
        src: img,
        scale: 0.06,
      }),
      text: new Text({
        font: '12px Calibri,sans-serif',
        text: name,
        offsetY: -50,
        fill: new Fill({ color: '#000' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
        textAlign: 'center',
        textBaseline: 'middle',
      }),
    });

    const marker = new Feature({
      name,
      geometry: new Point(coordinate),
    });
    marker.setStyle(markerStyle);
    vectorSource.addFeature(marker);
  }

  createCircle(center: [number, number], radius: number, color: string, vectorSource: VectorSource) {
    const circleFeature = new Feature({
      geometry: new Circle(center, radius),
    });

    const circleStyle = new Style({
      stroke: new Stroke({ color, width: 2 }),
      fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
    });
    circleFeature.setStyle(circleStyle);
    vectorSource.addFeature(circleFeature);
  
    setTimeout(() => {
      const newCoords = this.livelocationbuoy1;
      const newcoords2 = this.livelocationbuoy2;
      const marker = vectorSource.getFeatures().find(f => f.get('name') === 'Buoy 1');
    
      if (marker) {
        marker.setGeometry(new Point(newCoords));
      }
    
      this.checkBuoyRange(newCoords);
      this.checkBuoyRange2(newcoords2);
    }, 2000);
  }

  // Adding flags to prevent multiple identical logs
  buoy1range ='';
  buoy2range = '';
   formatDistance(distancee:number) {
    return distancee.toFixed(14); // Formats to 14 decimal places
}
  checkBuoyRange(markerCoords: [number, number]): void {
     const ddd = this.formatDistance(this.buoy1danger)
    const distance = getDistance(this.center, markerCoords);
     if (distance > this.bouy1wrange && distance < this.buoy1danger) {
      this.buoy1range = `CWPRS01 Crossed Out of Warning Range`;
    } else if (distance > this.buoy1danger) {
      this.buoy1range = `CWPRS01 Crossed Danger Range`;
    } else {
      this.buoy1range = `Buoy is within range`;
    }
    const newState = distance > this.radius ? 'Buoy 1 missing or out of range' : 'Buoy 1 within range';
    // if (newState !== this.lastBuoyRangeState) {
      
    //   this.lastBuoyRangeState = newState;
    // }
  }

  checkBuoyRange2(markerCoords: [number, number]): void {
    const distance = getDistance(this.buoy2, markerCoords);
     const newWarningState = distance > this.wrange ? 'Buoy 2 far beyond range' : 'Buoy 2 within warning range';
    if(distance>this.buoy2wrange && distance < this.buoy2danger){
      this.buoy2range = `CWPRS02 Crossed Out of Warning Range`;
    }else if(distance > this.buoy2danger){
      this.buoy2range = `CWPRS02 Crossed Danger Range`;
    }
    // if (newWarningState !== this.lastWarningState) {
      
    //   this.lastWarningState = newWarningState;
    // }




  }




}
