<template>
      <div id="chartdiv">
        <select v-if="ages.length > 0" v-model="selectedAge">
            <option v-for="age in ages" v-bind:key="age">
                {{ age }}
            </option>
            </select>
        <select v-if="parties.length > 0" v-model="selected1">
            <option v-for="party in parties" v-bind:key="party">
                {{ party }}
            </option>
            </select>
        <select v-if="parties.length > 0" v-model="selected2">
            <option v-for="party in parties" v-bind:key="party">
                {{ party }}
            </option>
            </select>
        
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
      margin: {top: 35, left: 35, bottom: 30, right: 0},
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
            this.width = 700;
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
        const vm = this;

        function makeData(party, age) {
        const spendData = vm.dayData.filter(d => d.partij === party);
        const spend = +spendData[(spendData.length) - 1].midden;

        const targeted = vm.targetData.filter(d => d.partij === party && d.age === age);
        const som = d3.sum(Array.from(new Set(targeted.map(d => +d["percentage geslacht/leeftijd"].replace(',', '.')))));

        const spendTarget = spend / 100 * som;
        const spendElse = spend - spendTarget;

        return { partij: party, targetedSpending: Math.round(spendTarget), nonTargetedSpending: Math.round(spendElse), targetedPercentage: som, spendTotal: spend }
      }
        
        const data = [makeData(this.selected1, this.selectedAge), makeData(this.selected2, this.selectedAge)];
        console.log("DATa", data);

        const svg = d3.select("#chart"),
		margin = {top: 35, left: 35, bottom: 0, right: 0},
		width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;
        
        const x = d3.scaleBand()
		.range([margin.left, width - margin.right])
        .padding(0.1)
        .domain(data.map(d => d.partij));

        const y = d3.scaleLinear()
        .rangeRound([height - margin.bottom, margin.top])
        .domain([0, d3.max(data, d => d.spendTotal)]).nice();


        svg.selectAll(".y-axis").transition().duration(750)
            .call(d3.axisLeft(y).ticks(null, "s"))
        
        svg.selectAll(".x-axis").transition().duration(750)
            .call(d3.axisBottom(x).tickSizeOuter(0))

        const keys = ["targetedSpending", "nonTargetedSpending"];
        
        var z = d3.scaleOrdinal()
		.range(["steelblue", "darkorange", "lightblue"])
		.domain(keys);
        
        var group = svg.selectAll("g.layer")
			.data(d3.stack().keys(keys)(data), d => d.key)

		group.exit().remove()

		group.enter().append("g")
			.classed("layer", true)
			.attr("fill", d => z(d.key));

		var bars = svg.selectAll("g.layer").selectAll("rect")
            .data(d => d, e => e.data.partij);
        
        bars.attr("width", x.bandwidth())
            
        bars            
            .attr("x", d => x(d.data.partij))
            .transition().ease(d3.easeSinOut).duration(300)
			.attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            
        bars
        .enter()
        .append("rect")
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("x", d => x(d.data.partij))
            .transition().ease(d3.easeSinOut).duration(400)
            .attr("y", d => y(d[1]))

        bars.exit().remove()

		var text = svg.selectAll(".text")
            .data(data, d => d.partij);
            
        text
		.transition().duration(350)
			.attr("x", d => x(d.partij) + x.bandwidth() / 2)
			.attr("y", d => y(d.spendTotal) - 5)
            .text(d => d.spendTotal)

		text.enter().append("text")
			.attr("class", "text")
			.attr("text-anchor", "middle")
            .attr("x", d => x(d.partij) + x.bandwidth() / 2)
            .transition().duration(400)
			.attr("y", d => y(d.spendTotal) - 5)
            .text(d => d.spendTotal)

        text.exit().remove()
            
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
