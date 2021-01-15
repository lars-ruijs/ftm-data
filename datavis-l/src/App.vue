<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <!-- <router-view :msg="dayData" /> -->
  <router-view :dayData="dayData" :eventData="eventData" :targetData="targetData" />
</template>

<script>
//import * as d3 from "d3";
import * as adsData from "@/assets/data";

export default {
  name: 'App',
  data() {
    return {
      dayData: [],
      eventData: [],
      targetData: [],
    };
  },
   mounted() {
    // Execute function fetchData to get the RDW data
    this.fetchData();
   },
  methods: {
    async fetchData() {
      // Fetch the day dashboard data 
      const specData = await adsData.dayData();
      this.dayData = specData;

      // Fetch the event dashboard data
      const events = await adsData.eventData();
      this.eventData = events;

      const target = await adsData.targetData();
      this.targetData = target;
      
      // const partijen = Array.from(new Set(target.map(d => d.partij)));
      // const leeftijden = Array.from(new Set(target.map(d => d.age)));

      // function makeData(party, age) {
      //   const spendData = specData.filter(d => d.partij === party);
      //   const spend = +spendData[(spendData.length) - 1].midden;

      //   const targeted = target.filter(d => d.partij === party && d.age === age);
      //   const som = d3.sum(Array.from(new Set(targeted.map(d => +d["percentage geslacht/leeftijd"].replace(',', '.')))));
      //   //const gemid = d3.mean(targeted, d => +d["percentage geslacht/leeftijd"].replace(',', '.'));

      //   const spendTarget = spend / 100 * som;
      //   const spendElse = spend - spendTarget;

      //   return { partij: party, targetedSpending: Math.round(spendTarget), nonTargetedSpending: Math.round(spendElse), targetedPercentage: som  }
      // }

      //console.log([makeData("D66", "65+"), makeData("50Plus", "65+")]);
    }
  },
}
</script>

<style>
/* Import external fonts:
   Page titles: 'Open Sans Condensed', sans-serif
   Page body: 'PT Serif', serif;
   Graph text: 'PT Sans', sans-serif;
*/

@import url('https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@700&family=IBM+Plex+Sans:wght@500&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap');

:root {
  --body-color: #000000;
  --link-color: #39b2b1;
  --link-hover: #2a8585;
  --ftm-red: #dd3230;
  --ftm-grey: #f6f6f6;
  --ftm-blue: #d1e8ea;
  --ftm-title: 'Open Sans Condensed', sans-serif;
  --ftm-body: 'PT Serif', serif;
  --ftm-graph: 'PT Sans', sans-serif;  
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}

svg {
  display: block;
}

.axis-label {
  font-family: var(--ftm-graph);
  font-size: 1.4em;
  fill: #aaaaaa;
  font-style: italic;
}

#chartdiv svg path.domain {
  display: none;
}

#chartdiv svg g.y-axis g.tick text {
  font-size: 1.3em;
  fill: #aaaaaa;
}

#chartdiv svg g.y-axis g.tick line {
  stroke: #aaaaaa;
}

.tick text {
  font-family: var(--ftm-graph);
  font-size: 1.2em;
}

a {
  text-decoration: none;
}

button {
  outline: none;
  border: none;
  cursor: pointer;
}

h1, h2, h3 {
  font-family: var(--ftm-title);
  color: var(--body-color);
  line-height: 1.2em;
}

h1 {
  font-size: 2.9em;
  margin: 1em 0 0.5em 0;
}

h2 {
  margin-top: 1.5em;
}

.home h1:first-child {
  margin-top: 2.5em;
}

.home a {
  color: var(--link-color);
  text-decoration: underline;
}

p {
  font-family: var(--ftm-body);
  color: var(--body-color);
  margin: 1em 0;
  line-height: 1.7em;
}

p.summary {
  font-family: var(--ftm-body);
  font-weight: bold;
}

.home {
  margin: 0 auto;
  width: 50%;
}

.top-bar {
  height: 3.8em;
  width: 100%;
  background-color: #292f32;
  position: fixed;
  top: 0;
  z-index: 999;
}

.top-bar a {
  color: white;
}

.items-top-bar img.eye {
  height: 3.8em;
}
.items-top-bar img.logo {
  height: 1.5em;
  margin-left: 1em;
}

.items-top-bar, nav ul {
  display: flex;
  align-items: center;
}

nav ul {
  list-style: none;
  margin: 0 1em 0 1em;
}

nav ul li {
  background-color: #343a3c;
  color: #fff;
  height: 4.5em;
  vertical-align: middle;
  line-height: 4.5em;
  margin-right: 0.5em;
  padding: 0 0.7em 0 0.7em;
  text-transform: uppercase;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 13px;
  letter-spacing: 0.1em;
}

.red {
  background-color: var(--ftm-red);
}

.red:hover {
  background-color: #e2514f;
}

.button {
  text-transform: uppercase;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 13px;
  letter-spacing: 0.1em;  
  color: #fff;
  padding: 1em;
  border-radius: 0.2em;
  margin-left: 0.6em;
  align-self: flex-start;
}

.buttongroup .button:last-of-type {
  margin-right: 2em;;
}

.buttongroup {
  margin-left: auto;
}

.buttongroup .hidden {
  display: none;
}

.grey {
  border: 1px solid #fff;
  background-color: #696d6f;
}

.transparent {
  border: 1px solid #fff;
  background-color: transparent;
}

svg.frameslider g.tick, svg.frameslider g.parameter-value text  {
  display: none;
}

svg.frameslider path.handle {
  fill: var(--ftm-red);
  stroke: transparent;
}

svg.frameslider path.handle:focus {
  outline: none;
  box-shadow: none;
}

svg.frameslider line.track-inset {
  stroke:transparent;
}

#barchartdiv {
  position: relative;
}

.controls {
  position: absolute;
  bottom: 6em;
  left: 1em;
}

svg.scaledates g.slider line, svg.scaledates g.slider path {
  display: none;
}

svg.scaledates {
  margin-top: -1em;
}

g.parameter-value text {
  font-family: var(--ftm-graph);
  font-size: 12px;
  fill: rgb(170, 170, 170);
}

div.tooltip, div.tooltipstack {	
 position: absolute;
  text-align: center;
  max-width: 100%;
  max-height: 100%;
  padding: 0.8em;
  font: 0.8em var(--ftm-graph);
  background-color: #292f32;
  border: 0;
  border-radius: 8px;
  pointer-events: none;
  color: white;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.gridje {
    display: grid;
    grid-template-columns: 0.24fr 1fr;
    margin-top: 2em;
}
.partijselect {
    display: flex;
    max-width: 100%;
    justify-content: center;
}

label {
    display: block;
    font-family: var(--ftm-graph);
}

select#age{
    width: 6em;
    margin: 0.7em 0 1em 0;
}

.select-css {
  font-size: 1em;
  font-family: var(--ftm-graph);
  font-weight: 700;
  color: #444;
  padding: 0.5em 1.4em 0.5em 0.8em;
  margin: 0.7em 1.7em 0 0;
  width: 9em;
  border: 1px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
  border-radius: 0.4em;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='960px' height='560px' viewBox='0 0 960 560' enable-background='new 0 0 960 560' xml:space='preserve'%3E%3Cg id='Rounded_Rectangle_33_copy_4_1_'%3E%3Cpath d='M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937 c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937 c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right .7em top 50%;
  background-size: 1em;
}
.select-css:hover {
  border-color: #888;
  cursor: pointer;
}
.select-css:focus {
  border-color: #aaa;
  box-shadow: 0 0 1px 2px var(--ftm-red);  
  outline: none;
}
.select-css option {
  font-weight:normal;
}

@media (max-width: 1020px) { 
  nav ul li {
    font-size: 10px;
    margin-right: 0.3em;
    height: 6em;
    line-height: 6em;
  }
  .button:not(.controls) {
    font-size: 10px;
    margin-left: 0.3em;
  }
  .home {
    width: 80%;
  }

  div#chartdiv div.gridje {
    grid-template-columns: 1fr;
    margin-bottom: 1.5em;
}
 }

 @media (max-width: 825px) {
   nav {
     display: none;
   }
   .buttongroup .hidden {
    display: inline;
    margin-right: 1.5em;
  }
  .buttongroup .button:nth-last-child(-n+3) {
    display: none;
  }
 }

</style>
