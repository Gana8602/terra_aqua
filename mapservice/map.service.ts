import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { XYZ, Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Feature } from 'ol';
import { Point, Circle as OlCircle } from 'ol/geom';
import { Icon, Style, Stroke, Fill } from 'ol/style';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: Map;
  private marker!: Feature;

  initializeMap(target: string, center: [number, number], zoom: number): Map {
    const markerStyle = new Style({
      image: new Icon({
        src: '../../assets/buoy.png',
        scale: 0.04,
      }),
    });

    this.marker = new Feature({
      geometry: new Point(fromLonLat(center)),
    });
    this.marker.setStyle(markerStyle);

    const vectorSource = new VectorSource({
      features: [this.marker],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    this.map = new Map({
      target: target,
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
      }),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=c30d4b0044414082b818c93c793707a4',
          }),
        }),
        vectorLayer,
      ],
    });

    return this.map;
  }

  addCircle(center: [number, number], radius: number, color: string): void {
    const circleFeature = new Feature({
      geometry: new OlCircle(fromLonLat(center), radius),
    });

    const circleStyle = new Style({
      stroke: new Stroke({
        color: color,
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)',
      }),
    });
    circleFeature.setStyle(circleStyle);

    // Use type assertion to specify the layer type
    const vectorLayer = this.map.getLayers().item(1) as VectorLayer<VectorSource>;
    vectorLayer.getSource()?.addFeature(circleFeature);
  }

  updateMarker(newCoords: [number, number]): void {
    // Assert that the marker's geometry is a Point
    const geometry = this.marker.getGeometry() as Point;
    geometry.setCoordinates(fromLonLat(newCoords));
  }
}
