import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { CSVModel } from '../csvmodel';
import { scaleLinear, scaleBand, axisLeft, style } from 'd3';

@Component({
  selector: 'app-barchart',
  template: `<div class="d3-chart" #chart style="height: 300px; width: 600px; margin-top: 10%;"></div>`,
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit, OnChanges {
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;
  @Input() private data: CSVModel[] = [];
  private margin: any = { top: 50, right: 40, bottom: 77, left: 180 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
      if (this.data.length > 0) {
         this.createChart();
      }
  }

  createChart() {
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    d3.select('svg').remove();
    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const thin = svg.append('g')
                  .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const MaxLine = svg.append('g')
                  .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const thick = svg.append('g')
                  .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
                  .attr('fill-opacity', '0.5');
    thick.style('fill', 'green');
    thin.style('fill', 'green');
    MaxLine.style('fill', 'green');
    
    const xScale = scaleLinear()
                    .domain([0, d3.max(this.data, d => d.val_1)])
                    .range([0, this.width]);

    const xScale2 = scaleLinear()
                    .domain([0, d3.max(this.data, d => d.val_1)])
                    .range([0, this.width]);

    const yScaleThin = scaleBand()
                  .domain(this.data.map(d => d.Brand))
                  .range([0, this.height])
                  .padding(0.4);

    const yScaleThick = scaleBand()
                  .domain(this.data.map(d => d.Brand))
                  .range([0, this.height])
                  .padding(0.2);

    const yAxis = axisLeft(yScaleThin);

    thin.selectAll('rect')
        .data(this.data)
        .enter().append('rect')
        .attr('y', d => yScaleThin(d.Brand))
         .attr('width', d => xScale(d.val_1))
         .attr('height', 10);

    thick.selectAll('rect')
    .data(this.data)
    .enter().append('rect')
    .attr('y', d => yScaleThick(d.Brand))
     .attr('width', d => xScale2(d.val_2))
     .attr('height', 30);

    MaxLine.selectAll('rect')
     .data(this.data)
     .enter().append('rect')
     .attr('y', d => yScaleThick(d.Brand))
     .attr('x', d => xScale2(d.max_val))
     .attr('width', 5)
     .attr('height', 33);

    thin.append('g').call(yAxis);

  }

}
