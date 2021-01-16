<template>
      <div id="chartdiv">
        <label for="age">Leeftijd taget: </label>
        <select id="age" class="select" v-if="ages.length > 0" v-model="selectedAge">
            <option v-for="age in ages" :key="age">
                {{ age }}
            </option>
        </select>
      </div>
</template>

<script>
import * as d3 from "d3";
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
      
    async makeBarChart() {
        console.log(d3);
        const dedata = await mapGeo();
        console.log(dedata);
    },
}
}
</script>
