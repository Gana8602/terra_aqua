import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent {
  @Input() unit1: string = 'm/s'; // Default value for first unit
  @Input() unit2: string = 'knot'; // Default value for second unit
  selectedUnit: string = ''; // This will hold the selected unit

  // Handle the unit change (optional)
  onUnitChange() {
   }
}
