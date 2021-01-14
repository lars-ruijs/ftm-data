<template>
      <div id="chartdiv">
        <div class="gridje">
            <div>
                <label for="age">Leeftijd taget: </label>
                <select id="age" class="select-css" v-if="ages.length > 0" v-model="selectedAge">
                <option v-for="age in ages" v-bind:key="age">
                    {{ age }}
                </option>
                </select>
            </div>
        <div>
            <label for="partijselect">Vergelijk twee politieke partijen: </label>
            <select class="select-css" v-if="parties.length > 0" v-model="selected1">
            <option v-for="party in parties" v-bind:key="party">
                {{ party }}
            </option>
            </select>
        <select class="select-css groei" v-if="parties.length > 0" v-model="selected2">
            <option v-for="party in parties" v-bind:key="party">
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
        this.dropy();
    },
  unmounted() {
        window.removeEventListener('resize', this.resize);
    },
  mounted() {
        // Build the bar chart race with the makeBarChart-function when element gets mounted
        this.makeBarChart();
  },
  updated() {
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

    dropy() {
        const partijen = Array.from(new Set(this.targetData.map(d => d.partij)));
        this.parties = partijen;

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
        //function euroFormat(d) { return '€' + d3.format("s")(d) }

        const formatNumber = numLocale.format(",d")

        const vm = this;

        function makeData(party, age) {
        const spendData = vm.dayData.filter(d => d.partij === party);
        const spend = +spendData[(spendData.length) - 1].midden;

        const targeted = vm.targetData.filter(d => d.partij === party && d.age === age);
        const som = d3.sum(Array.from(new Set(targeted.map(d => +d["percentage geslacht/leeftijd"].replace(',', '.')))));

        const spendTarget = spend / 100 * som;
        const spendElse = spend - spendTarget;

        return { partij: party, nonTargetedSpending: Math.round(spendElse), targetedSpending: Math.round(spendTarget), targetedPercentage: som.toFixed(0), spendTotal: spend }
      }
        
        const data = [makeData(this.selected1, this.selectedAge), makeData(this.selected2, this.selectedAge)];
        console.log("DATa", data);

        const svg = d3.select("#chart"),
		margin = {top: this.margin.top, left: this.margin.left, bottom: 0, right: this.margin.right},
		width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;
        
        const x = d3.scaleBand()
		.range([margin.left, width - margin.right])
        .padding(0.2)
        .domain(data.map(d => d.partij));

        const y = d3.scaleLinear()
        .rangeRound([height - margin.bottom, margin.top])
        .domain([0, d3.max(data, d => d.spendTotal)]).nice()
    
        svg.selectAll(".y-axis").transition().duration(750)
            .call(d3.axisLeft(y).ticks(null, "s"))
        
        const yas= svg.selectAll(".y-axis")

        yas
        .append('text')
                .attr('class', 'axis-label')
                .attr('y', -50)
                .attr('x', -this.height/2+35)
                .attr("transform", `rotate(-90)`)
                .text("Uitgaven advertenties (in €) →");

        const keys = ["targetedSpending", "nonTargetedSpending"];
        
        const z = d3.scaleOrdinal()
		.range(["var(--ftm-red)", "#d1e8ea", "lightblue"])
        .domain(keys);
        
        // Append a div to the body, used as a tooltip
        const div = d3.select("body").append("div")	
        .attr("class", "tooltipstack")				
        .style("opacity", 0);

        const group = svg.selectAll("g.layer")
			.data(d3.stack().keys(keys)(data), d => d.key)

		group.exit().remove()

		group.enter().append("g")
			.classed("layer", true)
			.attr("fill", d => z(d.key));

		const bars = svg.selectAll("g.layer").selectAll("rect")
            .data(d => d, e => e.data.partij);
        
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

        bars.exit().remove()

		const percentage = svg.selectAll(".percentage")
            .data(data, d => d.partij);
            
        percentage
		.transition().duration(350)
			.attr("x", d => x(d.partij) + x.bandwidth() / 2)
			.attr("y", d => y(d.spendTotal) - 37)
            .text(d => `${d.targetedPercentage}% getarget`)
 
		percentage.enter().append("text")
			.attr("class", "percentage")
			.attr("text-anchor", "middle")
            .attr("x", d => x(d.partij) + x.bandwidth() / 2)
            .transition().duration(400)
			.attr("y", d => y(d.spendTotal) - 37)
            .text(d => `${d.targetedPercentage}% getarget`)
            .attr("font-family", "var(--ftm-graph)")
            .attr("fill", "var(--ftm-red)")

        percentage.exit().remove()

        const text = svg.selectAll(".targetedSpend")
            .data(data, d => d.partij);
            
        text
		.transition().duration(350)
			.attr("x", d => x(d.partij) + x.bandwidth() / 2)
			.attr("y", d => y(d.spendTotal) - 17)
            .text(d => `€${formatNumber(d.targetedSpending)}`)
 
		text.enter().append("text")
			.attr("class", "targetedSpend")
			.attr("text-anchor", "middle")
            .attr("x", d => x(d.partij) + x.bandwidth() / 2)
            .transition().duration(400)
			.attr("y", d => y(d.spendTotal) - 17)
            .text(d => `€${formatNumber(d.targetedSpending)}`)
            .attr("font-family", "var(--ftm-graph)")
            .attr("font-weight", "600")
            .attr("fill", "var(--ftm-red)")

        text.exit().remove()

        //svg.select(".x-axis").selectAll("text").remove();

        const images = svg.select("g.x-axis").selectAll(".partijimg")
                    .data(data, d => d.partij);

        images
        .attr("width", x.bandwidth())
        .attr("x", d => x(d.partij) + x.bandwidth() / 110)
        .attr("href", function (d) { return `https://blissful-mcnulty-cc8e81.netlify.app/images/${d.partij}.png` ; })
        
                
        images      
        .enter()
        .append("svg:image")
            .attr("width", x.bandwidth())
            .attr("height", 50)
            .attr("x", d => x(d.partij) + x.bandwidth() / 110)
            .attr("y", 15)
            .attr("class", "partijimg")
            .attr("href", function (d) { return `https://blissful-mcnulty-cc8e81.netlify.app/images/${d.partij}.png` ; })
        
        images.exit().remove()


        // const totaal = svg.selectAll(".totalSpend")
        //     .data(data, d => d.partij);
            
        // totaal
		// .transition().duration(350)
		// 	.attr("x", d => x(d.partij) + x.bandwidth() / 2)
		// 	.attr("y", `${this.height-35}`)
        //     .text(d => `€${formatNumber(d.spendTotal)}`)
 
		// totaal.enter().append("text")
		// 	.attr("class", "targetedSpend")
		// 	.attr("text-anchor", "middle")
        //     .attr("x", d => x(d.partij) + x.bandwidth() / 2)
        //     .transition().duration(400)
		// 	.attr("y", `${this.height-35}`)
        //     .text(d => `Totaal: €${formatNumber(d.spendTotal)}`)
        //     .attr("font-family", "var(--ftm-graph)")
        //     .attr("fill", "#292f32")

        // totaal.exit().remove()

        
            
        // const group = svg.selectAll("g.layer")
        //     .data(d3.stack().keys(keys)(data), d => d.key)
        
		// group.enter().append("g")
		// 	.classed("layer", true)
        //     .attr("fill", d => z(d.key));

        // group.exit().remove()

        // const testing = svg.selectAll("g.layer");

		// var bars = testing.selectAll(".bartje")
        //     .data(d => d, e => e.data);
            
        // console.log(d3.selectAll("g.layer").selectAll("g.layer"));

        // bars
        // .transition().duration(750)
        // .attr("width", x.bandwidth())
        // .attr("x", d => x(d.data.partij))
        // .attr("y", d => y(d[1]))
        // .attr("height", d => y(d[0]) - y(d[1]))


        // bars
        // .enter()
        // .append("rect")
        //     .attr("width", x.bandwidth())
        //     .merge(bars)
		// 	.attr("x", d => x(d.data.partij))
		// 	.attr("y", d => y(d[1]))
        //     .attr("height", d => y(d[0]) - y(d[1]))
        //     .attr("class", "bartje")
        
        // bars.exit().remove()

		// var text = svg.selectAll(".text")
        //     .data(data, d => d.partij);
            
        // text.merge(text)
		// 	.attr("x", d => x(d.partij) + x.bandwidth() / 2)
		// 	.attr("y", d => y(d.spendTotal) - 5)
		// 	.text(d => d.spendTotal)

		// text.enter().append("text")
		// 	.attr("class", "text")
		// 	.attr("text-anchor", "middle")
		// 	.merge(text)
		// 	.attr("x", d => x(d.partij) + x.bandwidth() / 2)
		// 	.attr("y", d => y(d.spendTotal) - 5)
        //     .text(d => d.spendTotal)
        
        // text.exit().remove()

    },
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
