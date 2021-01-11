<template>
  <div class="barchartrace">
    <BarChartRace v-if="dayData.length > 0 && eventData.length > 0" :dayData="dayData" :eventData="eventData"/>
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
        eventData: {
            type: Array,
            required: true
        },
  },
  components: {
    BarChartRace
  }
}
</script>

<style scoped>
  div.barchartrace {
    max-width: 80vw;
  }
</style>