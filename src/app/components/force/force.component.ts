import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-force',
  templateUrl: './force.component.html',
  styleUrl: './force.component.scss',
})
export class ForceComponent implements OnInit {
  private svg: any;
  private margin = 50;
  private width = 750;
  private height = 600;

  private createSvg(): void {
    this.svg = d3
      .select('figure#force')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  private drawChart(): void {
    const diameter = 860;
    const radius = diameter / 2;
    const innerRadius = radius - 170;
    const cluster = d3.cluster().size([360, innerRadius]);
    const line = d3
      .lineRadial<any>()
      .curve(d3.curveBundle.beta(0.85))
      .radius((d) => d.y)
      .angle((d) => (d.x / 180) * Math.PI);
    
    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("color", "red");

    let link: d3.Selection<SVGPathElement, any, SVGGElement, unknown>, node: d3.Selection<SVGTextElement, d3.HierarchyNode<any>, SVGGElement, unknown>;

    d3.json<any>('assets/serviceNet1.json').then((classes) => {
      const root = this.packageHierarchy(classes).sum((d) => d.size);
      cluster(root);
      link = this.svg
        .append('g')
        .selectAll('.link')
        .data(this.packageImports(root.leaves()))
        .enter()
        .append('path')
        .each((d: any) => { (d.source = d[0]), (d.target = d[d.length - 1]); })
        .attr('class', 'link')
        .attr('d', line);
      node = this.svg
        .append('g')
        .selectAll('.node')
        .data(root.leaves())
        .enter()
        .append('text')
        .attr('class', 'node')
        .attr('dy', '0.31em')
        .attr( 'transform', (d: any) =>
            `rotate(${d.x - 90})translate(${d.y + 8},0)${ d.x < 180 ? '' : 'rotate(180)' }`
        )
        .attr('text-anchor', (d: any) => (d.x < 180 ? 'start' : 'end'))
        .text((d: any) => {
          //console.log(d);
          return d.data.key
        });
        //.on('mouseover', (event: any) => tooltip.html("<h4>" + event.srcElement.innerHTML + "</h4>").style("visibility", "visible").style("top", event.pageY + "px").style("left", event.pageX + "px"));
        //.on('mouseover', this.mouseovered.bind(this));
        //.on('mouseout', this.mouseouted.bind(this));
    });
  }

  // Lazily construct the package hierarchy from class names.
  private packageHierarchy(classes: any[]) {
    const map: { [key: string]: any } = {};
    function find(name: string, data?: { name: string; children: any[] }) {
      let node = map[name];
      let i: number;
      if (!node) {
        node = map[name] = data || { name: name, children: [] };
        if (name.length) {
          node.parent = find(name.substring(0, (i = name.lastIndexOf('.'))));
          node.parent.children.push(node);
          node.key = name.substring(i + 1);
        }
      }
      return node;
    }
    classes.forEach((d) => {
      find(d.name, d);
    });
    return d3.hierarchy(map['']);
  }

  // Return a list of imports for the given array of nodes.
  private packageImports(nodes: any[]) {
    const map: { [key: string]: any } = {};
    const imports: any[] = [];
    // Compute a map from name to node.
    nodes.forEach((d) => {
      map[d.data.name] = d;
    });
    // For each import, construct a link from the source to target node.
    nodes.forEach((d) => {
      if (d.data.imports) {
        d.data.imports.forEach((i: string | number) => {
          imports.push(map[d.data.name].path(map[i]));
        });
      }
    });
    return imports;
  }

  private mouseovered(node: any) {
    console.log(node);
    // node.each((n: any) => { n.target = n.source = false; });
    // // link
    // //   .classed('link--target', (l: any) => {
    // //     if (l.target.data === d.target.__data__.data) {
    // //       l.source.source = true;
    // //       return true;
    // //     }
    // //     return false;
    // //   })
    // //   .classed('link--source', (l: any) => {
    // //     if (l.source.data === d.target.__data__.data) {
    // //       l.target.target = true;
    // //       return true;
    // //     }
    // //     return false;
    // //   })
    // //   .filter((l: any) => l.target.data === d || l.source.data === d)
    // //   .raise();
    // node
    //   .classed('node--target', (n: any) => n.target)
    //   .classed('node--source', (n: any) => n.source);
  }

  // private mouseouted() {
  //   link
  //     .classed('link--target', false)
  //     .classed('link--source', false);
  
  //   node
  //     .classed('node--target', false)
  //     .classed('node--source', false);
  // }

  ngOnInit(): void {
    this.createSvg();
    this.drawChart();
  }
}
