<template>
  <div class="barchartrace">
    <h1>Welkom bij de Race!</h1>
    <BarChartRace :msg="msg"/>
  </div>
</template>

<script>
// @ is an alias to /src
import BarChartRace from '@/components/BarChartRace.vue'

export default {
  name: 'Spending',
  props: {
        msg: {
            type: Array,
            required: true
        },
  },
  components: {
    BarChartRace
  }
}
</script>
