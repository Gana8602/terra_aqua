import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import * as echarts from 'echarts';
import { HttpClient } from '@angular/common/http';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

interface SensorData {
  StationID: string;
  Date: string;
  Time: string;
  BatteryVoltage: string; // Adjust if necessary (number or string)
  S1_RelativeWaterLevel: string; // Adjust if necessary (number or string)
  S2_Bin1_Surface: string; // Adjust if necessary (number or string)
  S2_Bin4_Middle: string; // Adjust if necessary (number or string)
  S2_Bin7_Lower: string; // Adjust if necessary (number or string)
}

@Component({
  selector: 'app-homechart',
  standalone: true,
  imports: [CanvasJSAngularChartsModule],
  templateUrl: './homechart.component.html',
  styleUrls: ['./homechart.component.css'],
})
export class HomechartComponent implements OnInit, OnDestroy {
  private chartInstance: any;
  private batteryVoltage: number[] = [];
  private waterLevels: number[][] = []; // To hold multiple water level readings
  private timeCategories: string[] = [];
  private timer: any;
  private sensorDataList: SensorData[] = [];
  private httpClient = inject(HttpClient);

  ngOnInit(): void {
    this.fetchSensorData();
    this.initializeChart();
    // Fetch data when component initializes
    this.startDynamicUpdates();

    // Add resize event listener for chart resizing
    window.addEventListener('resize', () => {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    });
  }

  // Initialize the chart instance
  initializeChart(): void {
    const chartDom = document.getElementById('main')!;
    if (chartDom) {
      this.chartInstance = echarts.init(chartDom);
      this.setupChartOptions(); // Setup initial chart options
    } else {
    }
  }

  // Fetch sensor data from the API
  // Fetch sensor data from the API
  fetchSensorData(): void {
    // Log before fetching data

    this.httpClient
      .get<SensorData[]>('http://localhost:3000/api/users/sensorData')
      .subscribe(
        (data) => {
          // Check if fetched data is different from existing data
          if (JSON.stringify(data) !== JSON.stringify(this.sensorDataList)) {
            this.sensorDataList = data; // Update only if data has changed
            this.processData(); // Process the new data
            this.updateChartOptions(); // Update the chart with new data
          } else {
          }
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  // Process the data to extract battery voltage, water levels, and time categories
  processData(): void {
    this.batteryVoltage = []; // Clear previous data
    this.waterLevels = []; // Clear previous data
    this.timeCategories = []; // Clear previous data

    this.sensorDataList.forEach((dataPoint) => {
      // Convert date and time to a Date object
      const dateTime = new Date(`${dataPoint.Date}T${dataPoint.Time}`);

      // Push values into respective arrays
      this.batteryVoltage.push(Number(dataPoint.BatteryVoltage));
      this.waterLevels.push([
        Number(dataPoint.S1_RelativeWaterLevel),
        Number(dataPoint.S2_Bin1_Surface),
        Number(dataPoint.S2_Bin4_Middle),
        Number(dataPoint.S2_Bin7_Lower),
      ]);
      // Push formatted time into timeCategories
      this.timeCategories.push(dateTime.toLocaleTimeString());
    });

    // Log processed data to see if it's correct
  }

  // Setup the initial chart options (called once during initialization)
  setupChartOptions(): void {
    const option = {
      title: { text: '' },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: { backgroundColor: '#283b56' },
        },
      },
      legend: {},
      toolbox: {
        show: true,
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: this.timeCategories, // Ensure this is populated
      },
      yAxis: {
        type: 'value',
        scale: true,
        name: 'Values',
        max: 15,
        min: 0,
        boundaryGap: [0.2, 0.2],
      },
      series: [
        {
          name: 'Voltage',
          type: 'bar',
          data: this.batteryVoltage,
        },
        {
          name: 'Water Level',
          type: 'bar',
          data: this.waterLevels.map((level) => level[0]), // S1_RelativeWaterLevel
        },
        {
          name: 'Surface',
          type: 'bar',
          data: this.waterLevels.map((level) => level[1]), // S2_Bin1_Surface
        },
        {
          name: 'Middle',
          type: 'bar',
          data: this.waterLevels.map((level) => level[2]), // S2_Bin4_Middle
        },
        {
          name: 'Lower',
          type: 'line',
          data: this.waterLevels.map((level) => level[3]), // S2_Bin7_Lower
        },
      ],
    };

    if (this.chartInstance) {
      this.chartInstance.setOption(option);
    }
  }

  // Update the chart options with new data
  updateChartOptions(): void {
    if (this.chartInstance) {
      this.chartInstance.setOption({
        xAxis: {
          data: this.timeCategories, // Update xAxis with new time categories
        },
        series: [
          {
            name: 'Battery Voltage',
            data: this.batteryVoltage, // Update with new battery voltage data
          },
          {
            name: 'S1 Relative Water Level',
            data: this.waterLevels.map((level) => level[0]), // Update with new S1 data
          },
          {
            name: 'S2 Bin1 Surface',
            data: this.waterLevels.map((level) => level[1]), // Update with new S2 Bin1 data
          },
          {
            name: 'S2 Bin4 Middle',
            data: this.waterLevels.map((level) => level[2]), // Update with new S2 Bin4 data
          },
          {
            name: 'S2 Bin7 Lower',
            data: this.waterLevels.map((level) => level[3]), // Update with new S2 Bin7 data
          },
        ],
      });
    }
  }

  // Start dynamic updates for fetching new data
  startDynamicUpdates(): void {
    this.timer = setInterval(() => {
      this.fetchSensorData();
      // Fetch new data periodically
    }, 5000); // Fetch every 5 seconds
    // Fetch every 5 seconds
  }
  // Clear interval when the component is destroyed
  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    // Dispose of the chart instance when the component is destroyed
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }
}
