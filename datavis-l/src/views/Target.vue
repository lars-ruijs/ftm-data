<template>
  <div class="barchart">
    <StackedBarChart v-if="dayData.length > 0 && targetData.length > 0" :dayData="dayData" :targetData="targetData"/>
  </div>
</template>

<script>
// @ is an alias to /src
import StackedBarChart from '@/components/StackedBarChart.vue'

export default {
  name: 'Spending',
  props: {
        dayData: {
            type: Array,
            required: true
        },
        targetData: {
            type: Array,
            required: true
        },
        eventData: {
            type: Array,
            required: false
        },
  },
  components: {
    StackedBarChart
  }
}
</script>

<style scoped>
  div.barchart {
    max-width: 80vw;
  }
</style>