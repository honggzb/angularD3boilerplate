import { Injectable, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

/** This service will provide methods to enable user interaction with elements
  * while maintaining the d3 simulations physics
*/
@Injectable({
  providedIn: 'root',
})
export class D3Service {

    createSvg(id: string, margin: number, width: number, height: number): any {
        return  d3
          .select(id)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g');
    }

}