import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-battery',
  standalone: true,
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.css'],
  imports: [CommonModule],
})
export class BatteryComponent implements OnInit {
  @Input() batteryLevel: number = 3.4; // Default battery level in volts
  public batteryColor: string = 'green'; // Battery color based on level
  public fillHeight: string = '0%'; // To dynamically set battery fill height
  above_warning:number= 6;
  below_warning:number= 10;
  above_danger:number=2;
  below_danger:number=5;

  ngOnInit() {
    this.calculateBatteryColor();
    this.calculateBatteryFill();
  }

  // Calculate the color of the battery based on its level
  calculateBatteryColor() {
    if (this.batteryLevel > this.below_warning) {
      this.batteryColor = 'green'; // Full charge
    } 
    // If battery is between 10 and 6 (inclusive), assign yellow
    else if (this.batteryLevel <= this.below_warning && this.batteryLevel > this.above_warning) {
      this.batteryColor = 'yellow'; // Moderate charge
    } 
    // If battery is between 5 and 2 (inclusive), assign red
    else if (this.batteryLevel <= this.below_danger && this.batteryLevel > this.above_danger) {
      this.batteryColor = 'red'; // Low charge
    } 
    else {
      this.batteryColor = 'yellow'; // Unknown or out of defined range
    }
  }

  // Calculate the height of the battery fill based on the voltage
  calculateBatteryFill() {
    const maxLevel = 12.4; // Set your maximum level
    const minLevel = 0; // Below which it's considered low
    const fillPercentage = ((this.batteryLevel - minLevel) / (maxLevel - minLevel)) * 100;

    // Ensure fillPercentage is between 0% and 100%
    this.fillHeight = fillPercentage > 100 ? '100%' : fillPercentage < 0 ? '0%' : fillPercentage + '%';
  }
}
