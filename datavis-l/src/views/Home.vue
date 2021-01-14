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
      <a class="transparent button hidden" href="#">&#x2630; Menu</a>
     <a class="red button" href="#">Word lid</a>
     <a class="grey button" href="#">Doneer</a>
    <a class="transparent button" href="#">Inloggen</a>
   </div>
 </div>
 </div>
  <div class="home">
      <h1>Dashboard online advertenties politieke partijen</h1>
      <p class="summary">
        De campagnes voor de Tweede Kamerverkiezingen zijn inmiddels in volle gang, ook via advertenties op Facebook, Instagram, Google en YouTube. Follow the Money brengt de geldstromen van online advertenties in kaart. Hieruit blijkt dat bijna alle partijen de afgelopen tijd voor tienduizenden euro's aan advertenties kochten.
      </p>
      <p>
        In dit dashboard kun je de online campagnestrijd van politieke partijen live volgen tot aan de verkiezingen van de Tweede Kamer op 17 maart 2021. De data in dit dashboard is verzameld vanaf 1 september 2020 en is afkomsting van publicaties vanuit Google en Facebook (Twitter staat politieke advertenties niet toe en op Snapchat wordt niet geadverteerd door politieke partijen). Eerder schreven we al een inleidend artikel over online advertenties van politieke partijen, inclusief reacties van de betreffende partijen. Mocht je het artikel nog niet hebben gelezen, dan vind je het <a href="https://www.ftm.nl/artikelen/politieke-partijen-online-reclame" target="_blank">hier</a>.
      </p>
      <h2>Hoeveel geld besteden politieke partijen aan online advertenties?</h2>
       <p>
        Op 17 maart 2021 zijn de Tweede Kamerverkiezingen. De campagnes daarvoor zijn inmiddels in volle gang, ook via advertenties op Facebook, Instagram, Google en YouTube. Hieronder zie je hoeveel geld de Nederlandse politieke partijen sinds september bij deze platforms hebben uitgeven.
      </p>
      <BarChartRace class="marge" v-if="dayData.length > 0 && eventData.length > 0" :dayData="dayData" :eventData="eventData"/>
      <p>
        Op 17 maart 2021 zijn de Tweede Kamerverkiezingen. De campagnes daarvoor zijn inmiddels in volle gang, ook via advertenties op Facebook, Instagram, Google en YouTube. Hieronder zie je hoeveel geld de Nederlandse politieke partijen sinds september bij deze platforms hebben uitgeven.
      </p>
      <h2>Hoe targetten partijen leeftijdsgroepen?</h2>
      <p>
        Op 17 maart 2021 zijn de Tweede Kamerverkiezingen. De campagnes daarvoor zijn inmiddels in volle gang, ook via advertenties op Facebook, Instagram, Google en YouTube. Hieronder zie je hoeveel geld de Nederlandse politieke partijen sinds september bij deze platforms hebben uitgeven.
      </p>
      <StackedBarChart v-if="dayData.length > 0 && targetData.length > 0" :dayData="dayData" :targetData="targetData"/>
      <p>
        Op 17 maart 2021 zijn de Tweede Kamerverkiezingen. De campagnes daarvoor zijn inmiddels in volle gang, ook via advertenties op Facebook, Instagram, Google en YouTube. Hieronder zie je hoeveel geld de Nederlandse politieke partijen sinds september bij deze platforms hebben uitgeven.
      </p>
  </div>
</template>

<script>
// @ is an alias to /src
import BarChartRace from '@/components/BarChartRace.vue'
import StackedBarChart from '@/components/StackedBarChart.vue'

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
        targetData: {
            type: Array,
            required: true
        },
  },
  components: {
    BarChartRace,
    StackedBarChart
  }
}
</script>

<style scoped>
  .marge {
    margin: 2em 0;
  }
</style>