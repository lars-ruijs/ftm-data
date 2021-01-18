<template>
  <div class="barchartmap">
    <MapBar v-if="targetData.length > 0" :targetData="targetData"/>
  </div>
</template>

<script>
// @ is an alias to /src
import MapBar from '@/components/MapBar.vue'

export default {
  name: 'MapTarget',
  props: {
        dayData: {
            type: Array,
            required: false
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
    MapBar
  }
}
</script>

<style scoped>
  div.barchartmap {
    max-width: 80vw;
  }
</style>