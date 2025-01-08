import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Import RouterModule
import { SidenavComponent } from '../sidenav/sidenav.component';
import { HomeComponent } from '../home/home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ReportsComponent } from '../reports/reports.component';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { ConfigurationsComponent } from '../configurations/configurations.component';
import { UserComponent } from '../user/user.component';
import { TOAST_CONFIG, ToastrModule, ToastrService } from 'ngx-toastr';
import {
  SensorData,
  Config,
  StationConfigs,
  CurrentUser,
} from '../../model/config.model';
import { ConfigDataService } from '../config-data.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterModule, // Import RouterModule here
    SidenavComponent,
    HomeComponent,
    DashboardComponent,
    ReportsComponent,
    AnalyticsComponent,
    ConfigurationsComponent,
    UserComponent,
    ToastrModule,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'], // Fix typo from styleUrl to styleUrls,
  providers: [ConfigDataService, ToastrService],
})
export class LayoutComponent implements OnInit {
  sensorDataList: SensorData[] = [];
  httpClient = inject(HttpClient);
  page: String = '';
  selectedBuoy: string = '';
  configs: Config[] = [];
  StationConfig: StationConfigs[] = [];
  stationName1!: string;
  stationName2!: string;
  image1!: string;
  image2!: string;
  // currentUser!:CurrentUser;

  getScreenSize() {
    return { width: window.innerWidth, height: window.innerHeight };
  }
  constructor(
    private configss: ConfigDataService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService
  ) {}
  ngOnInit(): void {
    const scren = this.getScreenSize();

    // this.toast.success(`width: ${scren.width}`, `height: ${scren.height}`);
    this.route.paramMap.subscribe((params) => {
      this.page = params.get('page') || 'home';
    });
    // this.getStationConfig();
    this.sensors();
    this.getConfigs();

    setTimeout(() => {
      this.page = 'Home';
    }, 2);
  }

  assign() {}

  sensors() {
    this.httpClient
      .get(
        'http://localhost:3000/api/users/sensorData?fromDate=2024-01-10&toDate=2024-11-09'
      )
      .subscribe((data: any) => {
        // this.sensorDataList = data;
        // Optionally log the sensorDataList to verify
      });
  }

  getConfigs() {
    this.httpClient
      .get('http://localhost:3000/api/getconfigs')
      .subscribe((data: any) => {
        this.configs = data;
      });
  }

  // getStationConfig(){
  //   this.httpClient.get('http://localhost:3000/api/getstationconfig')
  //   .subscribe((data:any)=>{
  //     this.StationConfig=data;

  //   // this.StationConfig = this.layout.StationConfig;
  //   this.stationName1 = this.StationConfig[0].station_name;
  //   this.stationName2 = this.StationConfig[1].station_name;

  //   if(this.StationConfig[0].geo_format === "DMS"){

  //     const lat = this.StationConfig[0].latitude_deg + (this.StationConfig[0].latitude_min/60)+(this.StationConfig[0].latitude_min/3600);
  //     const lan = this.StationConfig[0].longitude_deg + (this.StationConfig[0].longitude_min/60)+(this.StationConfig[0].longitude_sec/3600);

  //   }else if(this.StationConfig[0].geo_format == "DD"){

  //   }else

  //   {

  //   }
  //     // this.assign();

  //   })
  // }
}
