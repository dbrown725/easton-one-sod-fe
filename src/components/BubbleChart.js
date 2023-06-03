import * as d3 from 'd3';

function BuildSVG(targetDivId, data, callback) {

  var width =  window.innerWidth;
  var height =  window.innerHeight;
  var diameter = height  - 150;
  if(height > width) {
    diameter = width;
  }

  //Large screens over 1500
  var textSize = 10; //in pixels
  var chartTitleX =50;
  var chartTitleY = 80;
  var chartTitleFontSize = 18;

  if(width < 800) {
    textSize = 4;
    chartTitleX = 10;
    chartTitleY = 20;
    chartTitleFontSize = 10;
  } else if(width < 1000) {
    textSize = 4;
    chartTitleX = 40;
    chartTitleY = 20;
    chartTitleFontSize = 10;
  } else if(width < 1500) {
    textSize = 8;
    chartTitleX = 10;
    chartTitleY = 20;
    chartTitleFontSize = 14;
  }
  const svg = BubbleChart(data, {  
    title: d => d.id,
    label: d => [d.id, d.value.toLocaleString("en")].join("\n"), 
    value: d => d.value,
    width: diameter,
    // height: window.innerHeight,
    fillOpacity: 1,
    textSize: textSize,
    chartTitleX: chartTitleX,
    chartTitleY: chartTitleY,
    chartTitleFontSize: chartTitleFontSize
    },
    callback);

  clearExistingSVG(targetDivId);
  if(document.getElementById(targetDivId) != null) {
    document.getElementById(targetDivId).appendChild(svg);
  }
}

function clearExistingSVG(targetDivId) {
  if(document.getElementById(targetDivId) != null) {
    var svgTag = document.getElementById(targetDivId)?.getElementsByTagName("svg");
    if(document.getElementById(targetDivId).hasChildNodes() && svgTag) {
      document.getElementById(targetDivId).removeChild(svgTag[0]);
    }
  }
}

// Modifications made to original observablehq.com code.
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bubble-chart
function BubbleChart(data, {
    name = ([x]) => x, // alias for label
    label = name, // given d in data, returns text to display on the bubble
    value = ([, y]) => y, // given d in data, returns a quantitative size
    group, // given d in data, returns a categorical value for color
    title, // given d in data, returns text to show on hover
    link, // given a node d, its link (if any)
    linkTarget = "_blank", // the target attribute for links, if any
    width = 640, // outer width, in pixels
    height = width, // outer height, in pixels
    padding = 3, // padding between circles
    margin = 1, // default margins
    marginTop = margin, // top margin, in pixels
    marginRight = margin, // right margin, in pixels
    marginBottom = margin, // bottom margin, in pixels
    marginLeft = margin, // left margin, in pixels
    groups, // array of group names (the domain of the color scale)
    colors = d3.schemeTableau10, // an array of colors (for groups)
    fill = "#ccc", // a static fill color, if no group channel is specified
    fillOpacity = 0.7, // the fill opacity of the bubbles
    stroke, // a static stroke around the bubbles
    strokeWidth, // the stroke width around the bubbles, if any
    strokeOpacity, // the stroke opacity around the bubbles, if any
    textSize = 10, // in pixels
    chartTitleX = 0,
    chartTitleY = 0,
    chartTitleFontSize = 18 // in pixels
  } = {}, callback) {
    // Compute the values.
    const D = d3.map(data, d => d);
    
    const V = d3.map(data, value);
    const G = group == null ? null : d3.map(data, group);
    const I = d3.range(V.length).filter(i => V[i] > 0);
  
    // Unique the groups.
    if (G && groups === undefined) groups = I.map(i => G[i]);
    groups = G && new d3.InternSet(groups);
  
    // Construct scales.
    //const color = G && d3.scaleOrdinal(groups, colors);
    const color = d3.scaleSequential().domain([1,10]).interpolator(d3.interpolateViridis);
    var continentColorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(data.values());
  
    // Compute labels and titles.
    const L = label == null ? null : d3.map(data, label);
    const T = title === undefined ? L : title == null ? null : d3.map(data, title);
  
    // Compute layout: create a 1-deep hierarchy, and pack it.
    const root = d3.pack()
        .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
        .padding(padding)
      (d3.hierarchy({children: I})
        .sum(i => V[i]));
  
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-marginLeft, -marginTop, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        .attr("fill", "currentColor")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle");

      svg.append("text")
        .attr("x", chartTitleX)             
        .attr("y", chartTitleY)
        .attr("text-anchor", "start") 
        .attr("font-family", "sans-serif") 
        .attr("font-weight", "bold") 
        .style("font-size", chartTitleFontSize + "px") 
        .text("Top 50 Bands");

      svg.append("text")
        .attr("x", chartTitleX)             
        .attr("y", chartTitleY + 15)
        .attr("text-anchor", "start") 
        .attr("font-family", "sans-serif") 
        .attr("font-weight", "bold") 
        .style("font-size", chartTitleFontSize - 4 + "px") 
        .text("Tap to search band name");   
  
    const leaf = svg.selectAll("a")
      .data(root.leaves())
      .join("a")
        .attr("xlink:href", link == null ? null : (d, i) => link(D[d.data], i, data))
        .attr("target", link == null ? null : linkTarget)
        .attr("transform", d => `translate(${d.x},${d.y})`);
  
    leaf.append("circle")
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", strokeOpacity)
        // .attr("fill", G ? d => color(G[d.data]) : fill == null ? "none" : fill)
        //.attr("fill", color)
        .attr("fill", function(d) { return continentColorScale(d); })
        .attr("fill-opacity", fillOpacity)
        .attr("r", d => d.r);
    
    if (T) leaf.append("title")
        .text(d => T[d.data]);
  
    if (L) {
      // A unique identifier for clip paths (to avoid conflicts).
      const uid = `O-${Math.random().toString(16).slice(2)}`;
  
      leaf.append("clipPath")
          .attr("id", d => `${uid}-clip-${d.data}`)
        .append("circle")
          .attr("r", d => d.r);
  
      leaf.append("text")
          .attr("clip-path", d => `url(${new URL(`#${uid}-clip-${d.data}`, window.location)})`)
        .selectAll("tspan")
        .data(d => `${L[d.data]}`.split(/\n/g))
        .join("tspan")
          .attr("x", 0)
          .attr("y", (d, i, D) => `${i - D.length / 2 + 0.85}em`)
          .attr("fill-opacity", (d, i, D) => i === D.length - 1 ? 0.7 : null)
          .attr("fill", "white")
          .attr("font-family", "sans-serif")
          .style("font-size", textSize+"px")
          .text(d => d);

       leaf.on("click", function() {
        callback(this.getElementsByTagName("title")[0].innerHTML);
      })  
    }
  
    return Object.assign(svg.node(), {scales: {color}});
  }

  export {
    BubbleChart,
    BuildSVG,
  }