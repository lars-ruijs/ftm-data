<template>
  <div class="barchartrace">
    <h1>Welkom bij de Race!</h1>
    <BarChartRace :dayData="dayData"/>
  </div>
</template>

<script>
// @ is an alias to /src
import BarChartRace from '@/components/BarChartRace.vue'

export default {
  name: 'Spending',
  props: {
        dayData: {
            type: Array,
            required: true
        },
  },
  components: {
    BarChartRace
  }
}
</script>
