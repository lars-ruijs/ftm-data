<template>
      <div id="chartdiv">
        <div class="grid">
            <div>
                <label for="age">Leeftijd taget: </label>
                <select id="age" class="select" v-if="ages.length > 0" v-model="selectedAge">
                    <option v-for="age in ages" :key="age">
                        {{ age }}
                    </option>
                </select>
            </div>
        <div>
            <label for="partyselect">Vergelijk twee politieke partijen: </label>
            <select id="partyselect" class="select" v-if="parties.length > 0" v-model="selected1">
                <option v-for="party in parties" :key="party">
                    {{ party }}
                </option>
            </select>
            <select class="select" v-if="parties.length > 0" v-model="selected2">
                <option v-for="party in parties" :key="party">
                    {{ party }}
                </option>
            </select>
        </div>
        </div>
        <svg :width="width" height="50">
            <circle cx="10" cy="20" r="9" fill="#d1e8ea"></circle>
            <text x="30" y="25" font-family="var(--ftm-graph)" fill="#292f32">Niet getarget</text>
            <circle cx="150" cy="20" r="9" fill="var(--ftm-red)"></circle>
            <text x="170" y="25" font-family="var(--ftm-graph)" fill="#292f32">Getarget</text>
        </svg>
        <svg id="chart" :width="width" :height="height">
            <g class="x-axis" :transform="`translate(0,${height - margin.bottom})`"></g>
            <g class="y-axis" :transform="`translate(${margin.left},0)`"></g>
        </svg>
      </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: 'BarChartRace',
  props: {
        dayData: {
            type: Array,
            required: true
        },
        targetData: {
            type: Array,
            required: true
        }
  },
  data() {
    return {
      width: 0,
      height: 400,
      margin: {top: 70, left: 60, bottom: 70, right: 0},
      parties: [],
      ages: [],
      selected1: "D66",
      selected2: "VVD", 
      selectedAge: "25-34",
    };
  },
  created() {
        // Add event listener that listens to changes in window size. 
        window.addEventListener('resize', this.resize);
        this.resize();
        this.dropdown();
    },
  unmounted() {
        window.removeEventListener('resize', this.resize);
    },
  mounted() {
        // Build the stacked bar chart with the makeBarChart-function when element gets mounted
        this.makeBarChart();
  },
  updated() {
        // Execute the makeBarChart() function again when data is updated by user. Using the updated() lifecycle.
        this.makeBarChart();
  },
  methods: {
    
    resize() {
        // Set the with of the bar chart race, depending on the viewport width
        if (window.innerWidth >= 1165) {
            this.width = 600;
        }
        else if (window.innerWidth < 1165 && window.innerWidth > 860) {
            this.width = 500;
        }
        else {
            this.width = 320;
        }
    },

    dropdown() {
        // Get a unique array with political party names from the target dataset (used for dropdown)
        const partijen = Array.from(new Set(this.targetData.map(d => d.partij)));
        this.parties = partijen;

        // Get a unique array with age groups based on the target dataset (used for dropdown). 
        const leeftijden = Array.from(new Set(this.targetData.map(d => d.age)));
        this.ages = leeftijden;
    },
      
    makeBarChart() {
        // Format numbers to local (Dutch) format 
        // Sources: https://github.com/d3/d3-format#locale_format & https://observablehq.com/@d3/d3-format
        const numLocale = d3.formatLocale({
            "decimal": ",",
            "thousands": ".",
            "grouping": [3],
            "currency": ["€", ""]
        })

        // Function used to format numbers to rounded "local" number
        const formatNumber = numLocale.format(",d")

        // Refer to global View Model
        const vm = this;

        // Function used to generate an object with filtered data (based on selected options) 
        function makeData(party, age) {

            // Get the data about spend budget - filter on selected party. 
            const spendData = vm.dayData.filter(d => d.partij === party);
            // Get the last average cumulative spend amound.
            const spend = +spendData[(spendData.length) - 1].midden;

            // Filter target dashboard data on the selected party and age group.
            const targeted = vm.targetData.filter(d => d.partij === party && d.age === age);
            // Calculate the sum of the unqiue target percentage for the selected party. 
            const som = d3.sum(Array.from(new Set(targeted.map(d => +d["percentage geslacht/leeftijd"].replace(',', '.')))));

            // Calculate the spend amound on targeted advertising
            const spendTarget = spend / 100 * som;
            // Calculate the remaining spend amound
            const spendElse = spend - spendTarget;

            // Return a filtered data object
            return { partij: party, nonTargetedSpending: Math.round(spendElse), targetedSpending: Math.round(spendTarget), targetedPercentage: som.toFixed(0), spendTotal: spend }
        }
        
        // Make a data-array with the selected options by the user
        const data = [makeData(this.selected1, this.selectedAge), makeData(this.selected2, this.selectedAge)];

        // Select the svg, set margins and with and height.
        const svg = d3.select("#chart"),
		margin = {top: this.margin.top, left: this.margin.left, bottom: 0, right: this.margin.right},
		width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;
        
        // X-scale with d3.scaleBand(). Set range to the innerWidth and the domain to the party names. 
        const x = d3.scaleBand()
		.range([margin.left, width - margin.right])
        .padding(0.2)
        .domain(data.map(d => d.partij));

        // Y-scale with d3.scaleLinear(). Set range to innerHeight and domain from 0 to maximum spend amound.
        const y = d3.scaleLinear()
        .rangeRound([height - margin.bottom, margin.top])
        .domain([0, d3.max(data, d => d.spendTotal)]).nice()
    
        svg.selectAll(".y-axis").transition().duration(750)
            .call(d3.axisLeft(y).ticks(null, "s"))
        
        const yAx= svg.selectAll(".y-axis")

        // Add an axis label to the Y-axis
        yAx
        .append('text')
                .attr('class', 'axis-label')
                .attr('y', -50)
                .attr('x', -this.height/2+35)
                .attr("transform", `rotate(-90)`)
                .text("Uitgaven advertenties (in €) →");

        // The order of the displayed stack
        const keys = ["targetedSpending", "nonTargetedSpending"];
        
        // Scale for the colors with d3.scaleOrdinal
        const color = d3.scaleOrdinal()
		.range(["var(--ftm-red)", "#d1e8ea"])
        .domain(keys);
        
        // Append a div to the body, used as a tooltip
        const div = d3.select("body").append("div")	
        .attr("class", "tooltipstack")				
        .style("opacity", 0);

        // Generate the stack layer groups (stacks of the bar chart). Set fill color to color function.
        // Source stacked bar chart: https://bl.ocks.org/LemoNode/5a64865728c6059ed89388b5f83d6b67 
        const group = svg.selectAll("g.layer")
			.data(d3.stack().keys(keys)(data), d => d.key)

		group.exit().remove()

		group.enter().append("g")
			.classed("layer", true)
			.attr("fill", d => color(d.key));

        // Generate the bars of the stacked bar chart. 
        const bars = svg.selectAll("g.layer").selectAll("rect")
            .data(d => d, e => e.data.partij);
        
        // Update the existing bars 
        bars.attr("width", x.bandwidth())   
        bars
            .on("mouseover", function(event, d) {
            // On hover, display the tooltip. Source: https://bl.ocks.org/d3noob/180287b6623496dbb5ac4b048813af52
            if (d[0] === 0) {
                div.html(`€${formatNumber(d[1])}`);
            }
            else if (d[0] > 0) {
                div.html(`€${formatNumber((d[1] - d[0]))}`);
            }
            div.style("left", (event.pageX - 20) + "px")		
                .style("top", (event.pageY + 5) + "px");

            d3.select(this).style("opacity", .4);	
            div.transition()		
                .duration(200)		
                .style("opacity", .9);			
            })					
            .on("mouseout", function() {
                d3.select(this).style("opacity", 1);			
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            })
            .attr("x", d => x(d.data.partij))
            .transition().ease(d3.easeSinOut).duration(300)
			.attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
         
        // Append new bars if necessary with enter().
        // Source stacked bar chart: https://bl.ocks.org/LemoNode/5a64865728c6059ed89388b5f83d6b67 
        bars
        .enter()
        .append("rect")
            .on("mouseover", function(event, d) {
            // On hover, display the tooltip. Source: https://bl.ocks.org/d3noob/180287b6623496dbb5ac4b048813af52
            if (d[0] === 0) {
                div.html(`€${formatNumber(d[1])}`);
            }
            else if (d[0] > 0) {
                div.html(`€${formatNumber((d[1] - d[0]))}`);
            }
            div.style("left", (event.pageX - 20) + "px")		
                .style("top", (event.pageY + 5) + "px");

            d3.select(this).style("opacity", .4);	
            div.transition()		
                .duration(200)		
                .style("opacity", .9);			
            })					
            .on("mouseout", function() {
                d3.select(this).style("opacity", 1);			
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            })
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("x", d => x(d.data.partij))
            .transition().ease(d3.easeSinOut).duration(400)
            .attr("y", d => y(d[1]))

        // Remove the bars that are no longer needed.
        bars.exit().remove()

        // Select all text elements with the class "percentage" - bind the data to it
        const percentage = svg.selectAll(".percentage")
            .data(data, d => d.partij);
        
        // Update the existing text elements 
        percentage
		.transition().duration(350)
			.attr("x", d => x(d.partij) + x.bandwidth() / 2)
			.attr("y", d => y(d.spendTotal) - 37)
            .text(d => `${d.targetedPercentage}% getarget`)
 
        // Append new text elements if necessary with enter()
        percentage
        .enter()
        .append("text")
			.attr("class", "percentage")
			.attr("text-anchor", "middle")
            .attr("x", d => x(d.partij) + x.bandwidth() / 2)
            .transition().duration(400)
			.attr("y", d => y(d.spendTotal) - 37)
            .text(d => `${d.targetedPercentage}% getarget`)
            .attr("font-family", "var(--ftm-graph)")
            .attr("fill", "var(--ftm-red)")

        // Remove text elements that are no longer needed
        percentage.exit().remove()

        // Select all text elements with the class "targetspend" - bind the data to it. 
        const text = svg.selectAll(".targetedSpend")
            .data(data, d => d.partij);
        
        // Update existing text
        text
		.transition().duration(350)
			.attr("x", d => x(d.partij) + x.bandwidth() / 2)
			.attr("y", d => y(d.spendTotal) - 17)
            .text(d => `€${formatNumber(d.targetedSpending)}`)
 
        // Append new text elements if necessary with enter()
        text
        .enter()
        .append("text")
			.attr("class", "targetedSpend")
			.attr("text-anchor", "middle")
            .attr("x", d => x(d.partij) + x.bandwidth() / 2)
            .transition().duration(400)
			.attr("y", d => y(d.spendTotal) - 17)
            .text(d => `€${formatNumber(d.targetedSpending)}`)
            .attr("font-family", "var(--ftm-graph)")
            .attr("font-weight", "600")
            .attr("fill", "var(--ftm-red)")

        // Remove text elements that are no longer needed.
        text.exit().remove()

        // Set political party images as X-axis ticks. 
        // Select al images with class "partijimg" - bind the data to it. 
        // Source: https://stackoverflow.com/questions/24763498/d3-js-using-images-with-filenames-specified-in-data-as-tick-values-on-axis
        const images = svg.select("g.x-axis").selectAll(".partijimg")
            .data(data, d => d.partij);

        // Update existing images
        images
            .attr("width", x.bandwidth())
            .attr("x", d => x(d.partij) + x.bandwidth() / 110)
            .attr("href", function (d) { return `https://blissful-mcnulty-cc8e81.netlify.app/images/${d.partij}.png` ; })
        
        // Append new images if necessary using enter()       
        images      
        .enter()
        .append("svg:image")
            .attr("width", x.bandwidth())
            .attr("height", 50)
            .attr("x", d => x(d.partij) + x.bandwidth() / 110)
            .attr("y", 15)
            .attr("class", "partijimg")
            .attr("href", function (d) { return `https://blissful-mcnulty-cc8e81.netlify.app/images/${d.partij}.png` ; })
        
        // Remove images that are no longer needed.
        images.exit().remove()
    },
}
}
</script>
