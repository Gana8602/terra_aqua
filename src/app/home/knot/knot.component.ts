import { Component, Input } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-knot',
  standalone: true,
  imports: [],
  templateUrl: './knot.component.html',
  styleUrl: './knot.component.css'
})
export class KnotComponent {
  maxVal = 180;
  initDeg = -45;
  maxDeg = 270;
  dangerLevel = 120;
  divFact = 10;
  multiplier = 1;
  gagueLabel = 'km/h';
  noOfDev = this.maxVal / this.divFact;
  divDeg = this.maxDeg / this.noOfDev;

  constructor() {}

  ngOnInit() {
    this.createIndicators();
  }

  createIndicators() {
    const envelope = document.querySelector('.envelope') as HTMLElement;
    let tempDiv = '';

    for (let i = 0; i <= this.noOfDev; i++) {
      const curDeg = this.initDeg + i * this.divDeg;
      const curIndVal = i * this.divFact;
      const dangCls = curIndVal >= this.dangerLevel ? 'danger' : '';

      const induCatorLinesPosY = 125 * Math.cos(0.01746 * curDeg);
      const induCatorLinesPosX = 125 * Math.sin(0.01746 * curDeg);

      if (i % 2 === 0) {
        tempDiv += `<div class="nob ${dangCls}" style="left:${induCatorLinesPosY}px;top:${induCatorLinesPosX}px;"></div>`;
        tempDiv += `<div class="numb ${dangCls}" style="left:${induCatorLinesPosY}px;top:${induCatorLinesPosX}px;">${curIndVal}</div>`;
      } else {
        tempDiv += `<div class="nob midNob" style="left:${induCatorLinesPosY}px;top:${induCatorLinesPosX}px;"></div>`;
      }
    }

    envelope.innerHTML += tempDiv;
  }

  changePosition(event: any) {
    const speed = +event.target.value;
    const speedInDeg = (this.maxDeg / this.maxVal) * speed + this.initDeg;

    const speedNobe = document.querySelector('.speedNobe') as HTMLElement;
    const speedPosition = document.querySelector('.speedPosition') as HTMLElement;

    speedNobe.style.transform = `rotate(${speedInDeg}deg)`;
    speedPosition.innerHTML = `${speed * this.multiplier} <br /> ${this.gagueLabel}`;

    this.highlightNobs(speed);
  }

  highlightNobs(speed: number) {
    const nobs = document.querySelectorAll('.nob');
    const nums = document.querySelectorAll('.numb');

    nobs.forEach((nob, i) => {
      if (i * this.divFact <= speed) {
        nob.classList.add('bright');
        nums[i].classList.add('bright');
      } else {
        nob.classList.remove('bright');
        nums[i].classList.remove('bright');
      }
    });
  }
}
