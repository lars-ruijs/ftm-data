<template>
 <div class="top-bar">
   <div class="items-top-bar">
   <img class="eye" src="@/assets/ftm-eye.png" alt="oog FTM">
   <img class="logo" src="@/assets/wordmark.png" alt="Follow the Money">
   <nav>
     <ul>
       <li>Over FTM</li>
       <li>Auteurs</li>
       <li>Dossiers</li>
       <li>Pitch</li>
       <li>Audio</li>
     </ul>
   </nav>
   <div class="buttongroup">
     <a class="red button" href="#">Word lid</a>
     <a class="grey button" href="#">Doneer</a>
    <a class="transparent button" href="#">Inloggen</a>
   </div>
 </div>
 </div>
  <div class="home">
      <h1>Dashboard online advertenties politieke partijen</h1>
      <p class="summary">
        De campagnes voor de Tweede Kamerverkiezingen zijn inmiddels in volle gang, ook via advertenties op Facebook, Instagram, Google en YouTube. Follow the Money brengt de geldstromen van online advertenties in kaart. Hieruit blijkt dat bijna alle partijen de afgelopen tijd voor tienduizenden euro aan advertenties kochten.
      </p>
      <p>
        Op 17 maart 2021 zijn de Tweede Kamerverkiezingen. De campagnes daarvoor zijn inmiddels in volle gang, ook via advertenties op Facebook, Instagram, Google en YouTube. Hieronder zie je hoeveel geld de Nederlandse politieke partijen sinds september bij deze platforms hebben uitgeven.
      </p>
      <BarChartRace v-if="dayData.length > 0 && eventData.length > 0" :dayData="dayData" :eventData="eventData"/>
  </div>
</template>

<script>
// @ is an alias to /src
import BarChartRace from '@/components/BarChartRace.vue'

export default {
  name: 'Home',
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
