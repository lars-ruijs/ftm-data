<template>
  <div class="hello">
      <h2>Hallo van Bar chart</h2>
      <h2>{{msg}}</h2>
  </div>
</template>

<script>
//import * as d3 from "d3";

export default {
  name: 'BarChartRace',
  props: {
        msg: {
            type: String,
            required: true
        },
  },
  data() {
    return {
      dayData: "",
      politicalData: [],
    };
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
