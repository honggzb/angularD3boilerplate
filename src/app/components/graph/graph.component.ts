import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as moment from 'moment';
import { ChartData } from '../../interfaces/chart.interface';

@Component({
  selector: 'area-chart',
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss',
})
export class GraphComponent implements OnInit {

  private data = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];
  private chartData_2D_1: ChartData = {
    yrange: 200000,
    lineData: [
      { label: 'Vue', value: 166443 },
      { label: 'React', value: 150793 },
      { label: 'Angular', value: 62342 },
      { label: 'Backbone', value: 27647 },
      { label: 'Ember', value: 21471 },
    ],
  };

  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  private createSvg(): void {
    this.svg = d3
      .select('figure#bar')
      .append('svg')
      .attr('width', this.width + this.margin * 2)
      .attr('height', this.height + this.margin * 2)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  constructor() { }
  
  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
    .range([0, this.width])
    .domain(data.map(d => d.Framework))
    .padding(0.2);
  
    // Draw the X-axis on the DOM
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
  
    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, 200000])
    .range([this.height, 0]);
  
    // Draw the Y-axis on the DOM
    this.svg.append("g")
    .call(d3.axisLeft(y));
  
    // Create and fill the bars
    this.svg.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d: any) => x(d.Framework))
    .attr("y", (d: any) => y(d.Stars))
    .attr("width", x.bandwidth())
    .attr("height", (d: any) => this.height - y(d.Stars))
    .attr("fill", "#d04a35");
  }

  ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.data);
    // Parse data from a CSV
    //d3.csv("/assets/frameworks.csv").then(data => this.drawBars(data));
    // Fetch JSON from an external endpoint
    // type ChartDataType = {
    //   Framework: string,
    //   Stars: number,
    //   Released: number
    // }
    //  d3.json('https://api.jsonbin.io/b/5eee6a5397cb753b4d149343').then(data=> {
    //   const chartData = data as ChartDataType[];
    //   this.drawBars(chartData);
    // });
  }

}
