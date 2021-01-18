<template>
    <div class="grid">
      <div id="map">
          <label>Regio target: </label>
          <p class="targetregio">{{ province }}</p>
      </div>
       <div id="barchart">
        <form id="selection">
            <label for="select">Leeftijd target: </label>
            <select id="select" class="select">
            <option value="13-17" >13-17</option>
            <option value="18-24" >18-24</option>
            <option value="25-34" selected>25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55-64">55-64</option>
            <option value="65+">65+</option>
            </select>
        </form>
        <svg width="300" height="40">
            <circle cx="10" cy="30" r="9" fill="#3486B8"></circle>
            <text x="30" y="35" font-family="var(--ftm-graph)" fill="#292f32">Man</text>
            <circle cx="90" cy="30" r="9" fill="#CE25BE"></circle>
            <text x="110" y="35" font-family="var(--ftm-graph)" fill="#292f32">Vrouw</text>
        </svg>
        </div>
    </div>
      <!-- <div id="chartdiv">
        <label for="age">Leeftijd taget: </label>
        <select id="age" class="select" v-if="ages.length > 0" v-model="selectedAge">
            <option v-for="age in ages" :key="age">
                {{ age }}
            </option>
        </select>
      </div> -->
</template>

<script>
import * as d3 from "d3";
import { feature } from "topojson";
import { mapGeo } from "@/assets/data";

export default {
  name: 'MapBar',
  props: {
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
      ages: [],
      selectedAge: "25-34",
      province: "Noord-Holland"
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
        this.drawMapVisu();
  },
//   updated() {
//         // Execute the makeBarChart() function again when data is updated by user. Using the updated() lifecycle.
//         this.makeBarChart();
//   },
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
        // Get a unique array with age groups based on the target dataset (used for dropdown). 
        const leeftijden = Array.from(new Set(this.targetData.map(d => d.age)));
        this.ages = leeftijden;
    },
      
    async drawMapVisu() {
    const vm = this;
        console.log(d3);
        const deData = this.targetData;
        console.log(deData);

    const nlData = await mapGeo()

    const path = d3.geoPath()

    const width = 280;
    const height = 410;

    const svg = d3.select('#map')
    .append('svg')
    .attr("width", width)
    .attr("height", height)

    

    const g = svg.append('g')
    .attr("transform", "translate(-365,-25)")

    const projection = d3.geoMercator().scale(4000).center([5.1, 52])
    const pathGenerator = path.projection(projection)

    const provincies = feature(nlData, nlData.objects.provincie_2020);
    
    g
    .append('g')
    .attr('fill', '#d1e8ea')
    .attr('stroke', 'white')
    .attr("stroke-width", .9)
    .selectAll('path')
    .data(provincies.features)
    .join('path')
    .attr('class', d => d.properties.statnaam)
    .attr('d', pathGenerator)
    
    
 makeBarChart()

 async function makeBarChart() {
    const deData = vm.targetData.map(d => ({...d, geo: d.geo.replace("North Brabant", "Noord-Brabant")}))

    const xValuePartij = deData.map(function(d) { return d.partij })
    const xValueGender = deData.map(function(d) { return d.gender })

    let breed;
    let padding; 

    if (vm.width > 320) {
        breed = 450
        padding = 0.4;
    }

    else if (vm.width <=320) {
        breed = 310
        padding = 0.3;
    }
    const margin = {top: 25, bottom: 20, left: 60, right: 0}
    const innerWidth = breed - margin.left - margin.right;

    let manData = []
    let vrouwData = []

    const cleanedData = deData.map(d => {
                        if(isNaN(d["percentage totaal"])) {
                            d["percentage totaal"] = +d["percentage totaal"].toString().replace(/,/g,".")
                        
                        } else {
                            d["percentage totaal"] = +d["percentage totaal"]
                        }
                        return d
                    })
                    
    cleanedData.forEach(d => {
                         if(d.gender == "man"){
                         var tempObj = {age: d.age, partij: d.partij, geo: d.geo, man: d["percentage totaal"]}
                         manData.push(tempObj)
                         } else {
                            var tempObjc = {age: d.age, partij: d.partij, geo: d.geo, vrouw: d["percentage totaal"]}
                            vrouwData.push(tempObjc)
                         }
                     })

    const container = d3.select('#barchart')
                     .append('svg')
                     .attr("width", breed)
                     .attr("height", 410)
                     .append('g')
                     .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScalePartij = d3.scaleBand()
                     .domain(xValuePartij)
                     .rangeRound([0, innerWidth])
                     .padding(padding)

    const xScaleGender = d3.scaleBand()
                     .domain(xValueGender)
                     .rangeRound([0, xScalePartij.bandwidth()])
                     .padding(padding)
                     
    let yScale = d3.scaleLinear()
                     .domain([0, 10])
                     .range([300,0])

    let yAxis = d3.axisLeft(yScale)
                     .tickSize(-600)
                     .tickFormat(function(d){return d+ "%"})

    const yAxisG = container.append('g').call(yAxis)
    .attr('class', 'y-as');

    const yAx= container.selectAll(".y-as")
        
        yAx
        .append('text')
                .attr('class', 'axis-label')
                .attr('y', -50)
                .attr('x', -410/2+130)
                .attr("transform", `rotate(-90)`)
                .text("Percentage weergaven naar doelgroep →");

    const xAxis = d3.axisBottom(xScalePartij)

    const xAxisG = container.append('g')
                            .call(xAxis)
                            .attr('transform', `translate(0,305)`)
                            .attr('class', `x-as`)
                            .selectAll('.tick line')
                            .remove()  

    console.log(xScaleGender, xAxisG);
    
    const selectOption = document.getElementById("select")
    
    let province = "Noord-Holland";                  
    let ageGrp = selectOption.value;
    
    g.selectAll('#map svg g g path')
    .on('mouseover', () => {
        g.selectAll(`#map svg g g path`)
        .style("cursor", "pointer");	
    })
    .on('click', (d) => {
        g.selectAll(`#map svg g g path`).attr('fill', '#d1e8ea');
        province = d.target.className.baseVal;
        makeBar(ageGrp, province)
        vm.province = province; 
        g.select(`#map svg g g path.${province}`).attr('fill', 'var(--ftm-red)');
    })

    selectOption.addEventListener('change', (e) => {
        ageGrp = selectOption.value;
        makeBar(ageGrp, province)
        console.log(e);
    })

    g.select(`#map svg g g path.Noord-Holland`).attr('fill', 'var(--ftm-red)');
    makeBar("25-34", "Noord-Holland")
    function makeBar(selectedAge, selectedProvincie) {
        
        function filterArray (d) {
            if (d.age == selectedAge && d.geo == selectedProvincie) {
                return d;
            }
        } 

        var newManArray = manData.filter(filterArray)
        var newWomanArray = vrouwData.filter(filterArray)

        const values = newManArray.map(d => d.man).concat(newWomanArray.map(d => d.vrouw));

        yScale.domain([0, d3.max(values)])
        yAxis = d3.axisLeft(yScale)
                  .tickSize(-600)
                  .tickFormat(function(d){return d+ "%"})
        yAxisG.call(yAxis)

        const rectMale = container.selectAll('.man').data(newManArray)

     container
        .selectAll('.man').transition().duration(1000)
        .attr('y', d => yScale(d.man))
        .attr('height', d =>300 - yScale(d.man))
        rectMale.enter()
        .append('rect')
        .attr('class', 'man')
        .attr('width', xScalePartij.bandwidth()/2)
        .attr('height', d => 300 - yScale(d.man))
        .attr('x', d => xScalePartij(d.partij))
        .attr('y', d => yScale(d.man))
        .attr('fill', "#3486B8")

        .exit().remove()
    
        const rectWoman = container.selectAll(".vrouw").data(newWomanArray)
    container
        .selectAll('.vrouw').transition().duration(1000)
        .attr('y', d => yScale(d.vrouw))
        .attr('height', d => 300 - yScale(d.vrouw))
        rectWoman.enter()
        .append('rect')
        .attr('class', 'vrouw')
        .attr('width', xScalePartij.bandwidth()/2)
        .attr('height', d => 300 - yScale(d.vrouw))
        .attr('x', d => xScalePartij(d.partij) + xScalePartij.bandwidth()/2)
        .attr('y', d => yScale(d.vrouw))
        .attr('fill', "#CE25BE")

        .exit().remove()

        container.selectAll("g.x-as g.tick text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
}
 }

    },
}
}
</script>