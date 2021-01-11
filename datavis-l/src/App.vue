<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <!-- <router-view :msg="dayData" /> -->
  <router-view :dayData="dayData" :eventData="eventData" />
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
  font-size: 3em;
  margin: 1em 0;
}

.home h1:first-child {
  margin-top: 3em;
}

p {
  font-family: var(--ftm-body);
  color: var(--body-color);
  margin: 1em 0;
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
  bottom: 7.5em;
  left: 1em;
}

svg.scaledates g.slider line, svg.scaledates g.slider path {
  display: none;
}

svg.scaledates {
  margin-top: -0.85em;
}

g.parameter-value text {
  font-family: var(--ftm-graph);
  font-size: 12px;
  fill: rgb(170, 170, 170);
}

div.tooltip {	
 position: absolute;
  text-align: center;
  max-width: 100%;
  max-height: 100%;
  padding: 0.8em;
  font: 0.8em var(--ftm-graph);
  background-color: black;
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
    width: 70%;
  }
 }

</style>
