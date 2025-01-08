import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../layout/layout.component';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map';
import View from 'ol/View';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Feature from 'ol/Feature';
import { Point, Circle } from 'ol/geom';
import { number, vector } from 'echarts';
import { parseNumber } from 'devextreme/localization';
import { UnitsComponent } from '../units/units.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FLOAT } from 'ol/webgl';
import { ConfigDataService } from '../config-data.service';
import {
  Config,
  SensorData,
  SensorData2,
  sensorLiveData,
  StationConfigs,
} from '../../model/config.model';
import { Toast, ToastrService } from 'ngx-toastr';
import { MapService } from '../../map/map.service';
import { subscribe } from 'diagnostics_channel';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DragDropModule } from '@angular/cdk/drag-drop';


export interface e_bins{
  name:string,
  bin:string,
  show:boolean
}

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [FormsModule, UnitsComponent, CommonModule,NgMultiSelectDropDownModule , DragDropModule],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.css',
})
export class ConfigurationsComponent implements OnInit {
  Lang!: number;
  Lat!: number;
  Warning!: number;
  Danger!: number;
  id!: string;
  // tide:number = 0;
  // battery:number = 12.3;
  stations: StationConfigs[] = [];
  tideOffset!: number;
  belowwarning: number = 0;
  abovewarning: number = 0;
  belowdanger: number = 0;
  abovedanger: number = 0;
  currentUnit: String = 'm/s';
  selectedStationType: string = ''; // Bind this to the dropdown
  stationTypes: string[] = [];
  selectedUnit: string = 'mtr';
  selectedcoordinate: string = 'DD';
  slectedOption: String = 'adcp';
  selectedcurrentUnit: string = 'm/s'; // Default selected unit
  show: boolean = false;
  latdeg!: number;
  latmin!: number;
  latsec!: number;
  langdeg!: number;
  langmin!: number;
  langsec!: number;
  sensor: Config[] = [];
  stationName!: string;
  finallat!: number;
  finallang!: number;
  driftValue!: string;
  driftDirection!: string;
  liveloclat1!: number;
  liveloclang1!: number;
  liveloclat2!: number;
  liveloclang2!: number;
  liveData!: sensorLiveData;
  buoy1!: SensorData[];
  buoy2!: SensorData2[];
  checked: boolean = false;

  dropdownList:any = [];
  selectedItems:any = [];
  dropdownSettings:IDropdownSettings = {};

  listBins: string[] = ['Profile1', 'Profile2', 'Profile3', 'Profile4', 'Profile5', 'Profile6', 'Profile7', 'Profile8', 'Profile9', 'Profile10'];
selectedSurface: string = '';
selectedMiddle: string = '';
selectedLower: string = '';
e_bin1:string = '';
e_bin2:string = '';
e_bin3:string = '';
e_bin4:string = '';
e_bin5:string = '';
e_bin6:string = '';
e_bin7:string = '';

//edit text
editone:string = '';
edittwo:string = '';
editthree:string = '';
editfour:string = '';
editfive:string = '';
editsix:string = '';
editseven:string = '';

isEdit1:boolean = false;
isEdit2:boolean = false;
isEdit3:boolean = false;
isEdit4:boolean = false;
isEdit5:boolean = false;
isEdit6:boolean = false;
isEdit7:boolean = false;


isView1!:boolean;
isView2!:boolean;
isView3!:boolean;
isView4!:boolean;
isView5!:boolean;
isView6!:boolean;
isView7!:boolean;

recieved_e_bins:e_bins[]=[

];

onEditTap(val:string){
  console.log(val);
  if(val == 'one'){
    this.isEdit1 = !this.isEdit1;
  }else if(val == 'two'){
    this.isEdit2=!this.isEdit2;
  }else if(val == 'three'){
    this.isEdit3=!this.isEdit3;
  }else if(val == 'four'){
    this.isEdit4=!this.isEdit4;
  }else if(val == 'five'){
    this.isEdit5=!this.isEdit5;
  }
  else if(val == 'six'){
    this.isEdit6=!this.isEdit6;
  }else if(val == 'seven'){
    this.isEdit7=!this.isEdit7;
  }

}
onOkTap(val:string){
  if(val == 'one'){
    this.isEdit1 = false;

  }else if(val == 'two'){
    this.isEdit2 = false;
  }else if(val == 'three'){
    this.isEdit3 = false;
  }else if(val == 'four'){
    this.isEdit4 = false;
  }else if(val == 'five'){
    this.isEdit5 = false;
  }else if(val == 'six'){
    this.isEdit6 = false;
  }else if(val == 'seven'){
    this.isEdit7 = false;
  }
}

onViewTap(val:string){
  if(val == 'one'){
    this.isView1 = !this.isView1;
  }else if(val == 'two'){
    this.isView2 = !this.isView2;
  }else if(val == 'three'){
    this.isView3 = !this.isView3;
  }else if(val == 'four'){
    this.isView4 = !this.isView4;
  }else if(val == 'five'){
    this.isView5 = !this.isView5;
  }else if(val == 'six'){
    this.isView6 = !this.isView6;
  }else if(val == 'seven'){
    this.isView7 = !this.isView7;
  }

}


getFilteredBins(current: string, exclude1: string, exclude2: string, exclude3: string, exclude4: string, exclude5: string, exclude6: string, exclude7: string, exclude8: string, exclude9: string): string[] {
  // Include the current selection and exclude the others
  return this.listBins.filter(bin => bin === current || (bin !== exclude1 && bin !== exclude2 && bin !== exclude3 && bin !== exclude4 && bin !== exclude5 && bin !== exclude6 && bin !== exclude7 && bin !== exclude8 && bin !== exclude9 ));
}
list:string[]= ['Profile1', 'Profile2', 'Profile3', 'Profile4', 'Profile5', 'Profile6', 'Profile7', 'Profile8', 'Profile9', 'Profile10'];
filterdList:string[]=[];
selected_e_bins:string[] = [];
onCheckboxChange(event: Event, item: string, i:number): void {
  console.log(`"number:""${i}"`,)
  const isChecked = (event.target as HTMLInputElement).checked;
  if (isChecked) {
    // Add item to the selected list if checked
    this.selected_e_bins.push(item);
    // console.log(this.selected_e_bins);
  } else {
    // Remove item from the selected list if unchecked
    this.selected_e_bins = this.selected_e_bins.filter(selectedItem => selectedItem !== item);
  }
  console.log(this.selected_e_bins); // To check the updated list in the console
}
maxSelection = 3
selecteds!:string;
onItemSelect(event: any) {
console.log(event);
this.selected_e_bins.push(event.item_text as string)
console.log(this.selected_e_bins, event.item_text)

}


onItemDeSelect(event: any) {
  this.selected_e_bins.indexOf(event.item_text as string)

  console.log('Deselected Item:', this.selected_e_bins);
  this.updateSelecteds()
}
updateSelecteds() {
  // Concatenate selected items into a single string
  this.selecteds = this.selectedItems.map((item: any) => item.item_text).join(', ');
  console.log(this.selecteds)
}

CurrentSelect() {
  console.log('Surface:', this.selectedSurface);
  console.log('Middle:', this.selectedMiddle);
  console.log('Lower:', this.selectedLower);
}

  
  dmsToDd(degrees: number, minutes: number, seconds: number): number {
    return degrees + minutes / 60 + seconds / 3600;
  }

  haversineDistanceAndDirection(
    loc1: [number, number],
    loc2: [number, number]
  ): { distance: number; direction: string } {
    const toRadians = (degree: number) => degree * (Math.PI / 180);
    const toDegrees = (radian: number) => radian * (180 / Math.PI);

    const R = 6371e3; // Radius of Earth in meters
    const φ1 = toRadians(loc1[1]);
    const φ2 = toRadians(loc2[1]);
    const Δφ = toRadians(loc2[1] - loc1[1]);
    const Δλ = toRadians(loc2[0] - loc1[0]);

    // Haversine formula to calculate distance
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters

    // Calculate the initial bearing (direction) in radians
    const x = Math.sin(Δλ) * Math.cos(φ2);
    const y =
      Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    let bearing = Math.atan2(x, y);

    // Convert bearing from radians to degrees
    bearing = toDegrees(bearing);

    // Normalize the bearing to be between 0 and 360 degrees
    bearing = (bearing + 360) % 360;

    // Map bearing to cardinal direction
    const directions = [
      { min: 0, max: 22.5, direction: 'N' },
      { min: 22.5, max: 67.5, direction: 'NE' },
      { min: 67.5, max: 112.5, direction: 'E' },
      { min: 112.5, max: 157.5, direction: 'SE' },
      { min: 157.5, max: 202.5, direction: 'S' },
      { min: 202.5, max: 247.5, direction: 'SW' },
      { min: 247.5, max: 292.5, direction: 'W' },
      { min: 292.5, max: 337.5, direction: 'NW' },
      { min: 337.5, max: 360, direction: 'N' },
    ];

    let direction = 'N'; // Default value
    for (const dir of directions) {
      if (bearing >= dir.min && bearing < dir.max) {
        direction = dir.direction;
        break;
      }
    }

    return { distance, direction };
  }

  travelPathAssign() {
    this.mapService.traveledPath = [];
    if (this.selectedStationType == 'CWPRS01') {
      this.mapService.traveledPath.push(
        fromLonLat([ 72.809854,18.992529 ]) as [number, number],
        fromLonLat([72.808718,18.991402]) as [number, number],
        fromLonLat([ 72.807554,18.992395 ])as [number, number],
        fromLonLat([this.buoy1[0].LONG, this.buoy1[0].LAT]) as [number, number]
      );
      for (let i = 0; i < this.buoy1.length; i++) {
        this.mapService.traveledPath.push(
          fromLonLat([this.buoy1[i].LONG, this.buoy1[i].LAT]) as [
            number,
            number
          ]
        );
      }
    } else if (this.selectedStationType == 'CWPRS02') {
      this.mapService.traveledPath.push(
        fromLonLat([this.buoy2[0].LONG, this.buoy2[0].LAT]) as [number, number]
      );
      for (let i = 0; i < this.buoy2.length; i++) {
        this.mapService.traveledPath.push(
          fromLonLat([this.buoy2[i].LONG, this.buoy2[i].LAT]) as [
            number,
            number
          ]
        );
      }
    }

    // console.log(this.mapService.traveledPath);
  }

  checking() {
    // this.mapService.destroyMap();
    this.checked = !this.checked;
    this.stationTypeSelect();
  }
  stationTypeSelect() {
    this.travelPathAssign();
    // console.log("Station selected:", this.selectedStationType);

    const selectedStation = this.stations.find(
      (station) => station.station_name === this.selectedStationType

    );
    console.log("selected station:" , selectedStation);

    if (selectedStation) {
      this.selectedcoordinate = selectedStation.geo_format;

      if (this.selectedcoordinate === 'DMS') {
        // Set DMS values
        this.latdeg = selectedStation.latitude_deg;
        this.latmin = selectedStation.latitude_min;
        this.latsec = selectedStation.latitude_sec;
        this.langdeg = selectedStation.longitude_deg;
        this.langmin = selectedStation.longitude_min;
        this.langsec = selectedStation.longitude_sec;
        this.Lat = 0;
        this.Lang = 0;
        this.finallang = this.dmsToDd(this.langdeg, this.langmin, this.langsec);
        this.finallat = this.dmsToDd(this.latdeg, this.latmin, this.langsec);
      } else if (this.selectedcoordinate === 'DD') {
        // Set DD values
        this.Lat = selectedStation.latitude_dd;
        this.Lang = selectedStation.longitude_dd;
        this.latdeg = 0;
        this.latmin = 0;
        this.latsec = 0;
        this.langdeg = 0;
        this.langmin = 0;
        this.langsec = 0;
      }
      this.stationName = selectedStation.station;
      this.Warning = selectedStation.warning_circle;
      this.Danger = selectedStation.danger_circle;

      // Update center and render the map with new station coordinates
      this.center = fromLonLat([this.Lang, this.Lat]);
      // console.log(this.center)
      if (this.selectedStationType == 'CWPRS01') {
        const point1 = fromLonLat([this.finallang, this.finallat]) as [
          number,
          number
        ];
        console.log("nano loc",point1);
        const point2 = fromLonLat([this.liveloclang1, this.liveloclat1]) as [
          number,
          number
        ];
        // console.log("point1:== ", point1, this.center);
        // console.log("point2: ==", point2);
        const distance = this.haversineDistanceAndDirection(point1, point2);
        // console.log(distance,'m');
        this.driftValue = distance.distance.toFixed(2);
        this.driftDirection = distance.direction;
      } else if (this.selectedStationType == 'CWPRS02') {
        const point1 = fromLonLat([this.Lang, this.Lat]) as [number, number];
        const point2 = fromLonLat([this.liveloclang2, this.liveloclat2]) as [
          number,
          number
        ];
        // console.log("point1:== ", point1);
        // console.log("point2: ==", point2);
        const distance = this.haversineDistanceAndDirection(point1, point2);
        // console.log(distance,'m');
        this.driftValue = distance.distance.toFixed(2);
        this.driftDirection = distance.direction;
      }

      if (this.selectedcoordinate == 'DD') {
        this.loadMapBasedOnStation(this.Lat, this.Lang, this.checked);
      } else if (this.selectedcoordinate == 'DMS') {
        this.loadMapBasedOnStation(this.finallat, this.finallang, this.checked);
      }
    } else {
      this.show = false;
      this.mapService.destroyMap();
    }
  }
  loadMapBasedOnStation(lat: number, lang: number, sho: boolean): void {
    this.mapService.destroyMap();
    const mapContainer = document.getElementById('ol-map'); // Target HTML element for map
    if (this.selectedStationType === 'CWPRS01') {
      // console.log("map:", mapContainer);
      this.mapService.createMap(
        mapContainer!,
        this.finallat,
        this.finallang,
        this.Warning,
        this.Danger,
        sho
      );
      this.show = true;
    } else if (this.selectedStationType == 'CWPRS02') {
      // console.log("map:", mapContainer);
      this.mapService.createMap(
        mapContainer!,
        lat,
        lang,
        this.Warning,
        this.Danger,
        sho
      );
      this.show = true;
    } else {
      this.mapService.destroyMap();
    }
  }
 
  assign() {
    
    this.tideOffset = parseFloat(this.sensor[0].value);
    this.selectedUnit = this.sensor[0].unit;
    this.selectedcurrentUnit = this.sensor[1].unit;
    this.belowwarning = parseFloat(this.sensor[2].below_warning);
    this.abovewarning = parseFloat(this.sensor[2].above_warning);
    this.belowdanger = parseFloat(this.sensor[2].below_danger);
    this.abovedanger = parseFloat(this.staion.configs[2].above_danger);
    const bin = this.sensor[1].bins;
    const bins = bin.split(',');
    console.log(bin, bins[0]) 
    this.selectedSurface = bins[0];
    this.selectedMiddle = bins[1];
    this.selectedLower = bins[2];
    const filteredList = this.list.filter(item => !bins[0].includes(item.trim()) && !bins[1].includes(item.trim()) && !bins[2].includes(item.trim()));
    this.filterdList = filteredList;
    this.updatedropdown(bin);
    // console.log(this.tideOffset, this.selectedUnit, this.selectedcurrentUnit,
    //   this.belowdanger,this.abovedanger, this.belowwarning, this.abovewarning
    // );
    const ee = this.sensor[1].e_bins;
    // console.log("e_bin:",ee);
    const ejson = JSON.parse(ee);
    
    this.recieved_e_bins = ejson;
    console.log(this.recieved_e_bins);
    this.editone = this.recieved_e_bins[0].name;
    this.edittwo = this.recieved_e_bins[1].name;
    this.editthree = this.recieved_e_bins[2].name;
    this.editfour = this.recieved_e_bins[3].name;
    this.editfive = this.recieved_e_bins[4].name;
    this.editsix = this.recieved_e_bins[5].name;
    this.editseven = this.recieved_e_bins[6].name;

    this.isView1 = this.recieved_e_bins[0].show;
    this.isView2 = this.recieved_e_bins[1].show;
    this.isView3 = this.recieved_e_bins[2].show;
    this.isView4 = this.recieved_e_bins[3].show;
    this.isView5 = this.recieved_e_bins[4].show;
    this.isView6 = this.recieved_e_bins[5].show;
    this.isView7 = this.recieved_e_bins[6].show;

    this.e_bin1 = this.recieved_e_bins[0].bin;
    this.e_bin2 = this.recieved_e_bins[1].bin;
    this.e_bin3 = this.recieved_e_bins[2].bin;
    this.e_bin4 = this.recieved_e_bins[3].bin;
    this.e_bin5 = this.recieved_e_bins[4].bin;
    this.e_bin6 = this.recieved_e_bins[5].bin;
    this.e_bin7 = this.recieved_e_bins[6].bin;

  }


   // Inside your ConfigurationsComponent class
   warningCircleStyle = new Style({
    stroke: new Stroke({
      color: 'yellow',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.2)', // Light red with transparency
    }),
  });

  dangerCircleStyle = new Style({
    stroke: new Stroke({
      color: 'red',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 0, 0.2)', // Light yellow with transparency
    }),
  });

  selecteoption(typee: String) {
    this.slectedOption = typee;
    
    // console.log(`selectedType : ${this.slectedOption}`);
  }

  selectUnit(unit: string) {
    this.selectedUnit = unit;
    // console.log(`Selected unit: ${this.selectedUnit}`);
  }
  selectcurrentUnit(unit: string) {
    this.selectedcurrentUnit = unit;
    // console.log(`Selected unit: ${this.selectedcurrentUnit}`);
  }
  selectcoordinate(unit: string) {
    this.selectedcoordinate = unit;
    // console.log(`Selected unit: ${this.selectedcoordinate}`);
  }
  ngOnInit(): void {
    this.dropdownassign()
    const date = new Date();
    const todayDate = date.toISOString().substr(0, 10);
    this.data.getSensorLiveData(todayDate, todayDate).subscribe((response) => {
      // console.log(response);
      this.liveData = response;
      this.buoy1 = this.liveData.buoy1;
      this.buoy2 = this.liveData.buoy2;

      this.liveloclat1 = this.buoy1[0].LAT;
      this.liveloclat2 = this.buoy2[0].LAT;
      this.liveloclang1 = this.buoy1[0].LONG;
      this.liveloclang2 = this.buoy2[0].LONG;
    });
    this.data.getStationNames().subscribe((stations) => {
      this.stations = stations;
      console.log("station setting", stations);

      for (let i in stations) {
        this.stationTypes.push(stations[i].station_name);
      }

      this.data.getsensorConfigs().subscribe((sensor) => {
        this.sensor = sensor;
        // console.log("Sensors==", this.sensor);
        if (this.sensor != null) {
          this.assign();
        }
      });
    });

    this.assign();
    this.map = new Map({
      target: 'ol-map',
      view: new View({
        center: this.center,
        zoom: 17,
      }),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          }),
        }),
      ],
    });
  }

  constructor(
    private staion: LayoutComponent,
    private http: HttpClient,
    private data: ConfigDataService,
    private taost: ToastrService,
    private mapService: MapService
  ) {}
  map!: Map;
  vectorLayer!: VectorLayer;
  map2!: Map;
  center = fromLonLat([80.19146988481407, 14.602590765602967]);
  RenderMap(): void {
    // Initialize `this.map` if it hasn't been created yet
    if (!this.map) {
      this.map = new Map({
        view: new View({
          center: this.center,
          zoom: 17,
        }),
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            }),
          }),
        ],
        target: 'ol-map',
      });
    }

    // Clear layers if `this.map` is already initialized
    else {
    }

    // Add layers
    const marker = new Feature({ geometry: new Point(this.center) });
    marker.setStyle(
      new Style({
        image: new Icon({ src: '../../assets/buoy.png', scale: 0.04 }),
      })
    );

    const circleFeature = new Feature({
      geometry: new Circle(this.center, this.Warning),
    });
    circleFeature.setStyle(
      new Style({
        stroke: new Stroke({ color: 'yellow', width: 2 }),
        fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
      })
    );

    const circleFeature2 = new Feature({
      geometry: new Circle(this.center, this.Danger),
    });
    circleFeature2.setStyle(
      new Style({
        stroke: new Stroke({ color: 'red', width: 2 }),
        fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
      })
    );

    const vectorSource = new VectorSource({
      features: [marker, circleFeature, circleFeature2],
    });
    const vectorLayer = new VectorLayer({ source: vectorSource });

    // Add `vectorLayer` to the map
    this.map.addLayer(vectorLayer);
    // this.map.getLayers().clear();
  }

  RenderMap2(): void {
    // Same logic as RenderMap for `this.map2`
    if (!this.map2) {
      this.map2 = new Map({
        view: new View({
          center: this.center,
          zoom: 17,
        }),
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'http://mt{0-3}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            }),
          }),
        ],
        target: 'ol-map',
      });
    } else {
      this.map2.getLayers().clear();
    }

    const marker = new Feature({ geometry: new Point(this.center) });
    marker.setStyle(
      new Style({
        image: new Icon({ src: '../../assets/buoy.png', scale: 0.04 }),
      })
    );

    const circleFeature = new Feature({
      geometry: new Circle(this.center, this.Warning),
    });
    circleFeature.setStyle(
      new Style({
        stroke: new Stroke({ color: 'yellow', width: 2 }),
        fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
      })
    );

    const circleFeature2 = new Feature({
      geometry: new Circle(this.center, this.Danger),
    });
    circleFeature2.setStyle(
      new Style({
        stroke: new Stroke({ color: 'red', width: 2 }),
        fill: new Fill({ color: 'rgba(0, 0, 255, 0.1)' }),
      })
    );

    const vectorSource = new VectorSource({
      features: [marker, circleFeature, circleFeature2],
    });
    const vectorLayer = new VectorLayer({ source: vectorSource });

    // Add `vectorLayer` to the map
    this.map2.addLayer(vectorLayer);
  }

  clickon(typr: String) {
    // console.log(typr);
  }

  //updates
  onsensorSubmit() {
    const e_bins_json = [
      {
        name:this.editone ?? "",
        bin:this.e_bin1 ?? "",
        show:this.isView1 ?? false
      },
      {
        name:this.edittwo ?? "",
        bin:this.e_bin2 ?? "",
        show:this.isView2 ?? false
      },
      {
        name:this.editthree ?? "",
        bin:this.e_bin3 ?? "",
        show:this.isView3 ?? false
      },
      {
        name:this.editfour ?? "",
        bin:this.e_bin4 ?? "",
        show:this.isView4 ?? false
      },
      {
        name:this.editfive ?? "",
        bin:this.e_bin5 ?? "",
        show:this.isView5 ?? false
      },
      {
        name:this.editsix ?? "",
        bin:this.e_bin6 ?? "",
        show:this.isView6 ?? false
      },
      {
        name:this.editseven ?? "",
        bin:this.e_bin7 ?? "",
        show:this.isView7 ?? false
      }
    ];
    const e_bins = JSON.stringify(e_bins_json);

    const binnn = `${this.selectedSurface},${this.selectedMiddle},${this.selectedLower}`;
    console.log("binnss: ===",binnn);
    // console.log("tapped", this.slectedOption);
    if(this.selectedItems >2){
      this.taost.error('You can select only 3 items');
      return;
    }else{
      let data: any = {};

    if (this.slectedOption === 'tide') {
      data = {
        sensor_type: this.slectedOption,
        value: this.tideOffset.toString(),
        unit: this.selectedUnit,

      };
      // console.log(data);
    } else if (this.slectedOption === 'adcp') {
      data = {
        sensor_type: this.slectedOption,
        unit: this.selectedcurrentUnit,
        bins: binnn,
        e_bins: e_bins
      };
      // console.log(data);
    } else if (this.slectedOption === 'battery') {
      data = {
        sensor_type: this.slectedOption.toString(),
        above_warning: this.abovewarning.toString(),
        below_warning: this.belowwarning.toString(),
        above_danger: this.abovedanger.toString(),
        below_danger: this.belowdanger.toString(),
      };
      // console.log(data);
    }

    this.http.put('http://localhost:3000/api/config', data).subscribe({
      next: (res) => {
        // console.log(res);
        this.taost.success('Sensor settings Updated', 'Success');
      },
      error: (err) => {
        this.taost.error('Sensor settings not updated', 'Please try again');
      },
    });
    }
    
  }

  onstationSubmit() {
    let stationConfigData = {};
    if (this.selectedcoordinate == 'DD') {
      stationConfigData = {
        station: this.stationName,
        station_name: this.selectedStationType,
        warning_circle: this.Warning,
        danger_circle: this.Danger,
        geo_format: this.selectedcoordinate, // or 'DMS'
        latitude_dd: this.Lat,
        longitude_dd: this.Lang,
        latitude_deg: null,
        latitude_min: null,
        latitude_sec: null,
        longitude_deg: null,
        longitude_min: null,
        longitude_sec: null,
      };
    } else if (this.selectedcoordinate == 'DMS') {
      stationConfigData = {
        station: this.stationName,
        station_name: this.selectedStationType,
        warning_circle: this.Warning,
        danger_circle: this.Danger,
        geo_format: this.selectedcoordinate, // or 'DMS'
        latitude_dd: null,
        longitude_dd: null,
        latitude_deg: this.latdeg,
        latitude_min: this.latmin,
        latitude_sec: this.latsec,
        longitude_deg: this.langdeg,
        longitude_min: this.langmin,
        longitude_sec: this.langsec,
      };
    }
    this.http
      .put(
        'http://localhost:3000/api/updatestationconfig',
        stationConfigData
      )
      .subscribe({
        next: (res) => {
          // console.log('response station config ==', res);
          this.taost.success('Station Configuration updated', 'Success');
        },
        error: (err) => {
          // console.error('Error occurred:', err);
          this.taost.error(
            'Error Updating Station Configuration',
            'Please try again'
          );
        },
      });
  }



  dropdownassign(){
    this.dropdownList = [
      { item_id: 1, item_text: 'Profile1' },
      { item_id: 2, item_text: 'Profile2' },
      { item_id: 3, item_text: 'Profile3' },
      { item_id: 4, item_text: 'Profile4' },
      { item_id: 5, item_text: 'Profile5' },
      { item_id: 6, item_text: 'Profile6' },
      { item_id: 7, item_text: 'Profile7' },
      { item_id: 8, item_text: 'Profile8' },
      { item_id: 9, item_text: 'Profile9' },
      { item_id:10,item_text: 'Profile10' },
    ];
    this.selectedItems = [
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 7,
      enableCheckAll:false,
      allowSearchFilter: false
    };
  }
  updatedropdown(binname: any) {
    // // Split the bin string into an array and trim spaces
    // const bins = binname.split(',').map((bin: string) => bin.trim());
  
    // // Filter the dropdown list for items matching any bin name
    // this.selected_e_bins = this.dropdownList.filter((item: { item_id: number; item_text: string }) =>
    //   bins.includes(item.item_text)
    // );
  
    // console.log('Selected Items:', this.selectedItems);
  }







  leftBox = ['Widget 1', 'Widget 2', 'Widget 3', 'Widget 4', 'Widget 5', 'Widget 6', 'Widget 7'];
  rightBox: string[] = [];

  // Move item from one box to another
  drop(event: any, targetBox: string[]) {
    
    const sourceBox = event.previousContainer.data;
    const item = sourceBox[event.previousIndex];

    if (event.previousContainer === event.container) {
      // Same container, do nothing
      return;
    }

    // Remove item from the source
    sourceBox.splice(event.previousIndex, 1);

    // Add item to the target
    targetBox.splice(event.currentIndex, 0, item);

    console.log(this.rightBox)
  }

  // Remove item from right and add back to left
  removeItem(item: string) {
    const index = this.rightBox.indexOf(item);
    if (index > -1) {
      this.rightBox.splice(index, 1);
      this.leftBox.push(item);
    }
  }
}
