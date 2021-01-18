<template>
 <div class="top-bar">
   <div class="items-top-bar">
   <img class="eye" src="@/assets/ftm-eye.png" alt="oog FTM">
   <img class="logo" src="@/assets/wordmark.png" alt="Follow the Money">
   <nav>
     <ul>
       <li><a href="https://www.ftm.nl/over-ftm" target="_blank">Over FTM</a></li>
       <li><a href="https://www.ftm.nl/auteurs" target="_blank">Auteurs</a></li>
       <li><a href="https://www.ftm.nl/dossiers" target="_blank">Dossiers</a></li>
       <li><a href="https://www.ftm.nl/pitch" target="_blank">Pitch</a></li>
       <li><a href="https://www.ftm.nl/audio" target="_blank">Audio</a></li>
     </ul>
   </nav>
   <div class="buttongroup">
      <a class="transparent button hidden" href="https://www.ftm.nl/" target="_blank">&#x2630; Menu</a>
     <a class="red button" href="https://www.ftm.nl/word-lid" target="_blank">Word lid</a>
     <a class="grey button" href="https://www.ftm.nl/doneer/" target="_blank">Doneer</a>
    <a class="transparent button" href="https://www.ftm.nl/inloggen" target="_blank">Inloggen</a>
   </div>
 </div>
 </div>
  <div class="home">
      <h1>Dashboard online advertenties politieke partijen</h1>
      <p class="summary">
        De campagnes voor de Tweede Kamerverkiezingen zijn inmiddels in volle gang, ook via advertenties op Facebook, Instagram, Google en YouTube. Follow the Money brengt de geldstromen van online advertenties in kaart. Hieruit blijkt dat bijna alle partijen de afgelopen tijd voor tienduizenden euro's aan advertenties kochten.
      </p>
      <p>
        In dit dashboard kun je de online campagnestrijd van politieke partijen live volgen tot aan de verkiezingen van de Tweede Kamer op 17 maart 2021. De data in dit dashboard is verzameld vanaf 1 september 2020 en is afkomsting van publicaties vanuit Google en Facebook. Eerder schreven we al een inleidend artikel over online advertenties van politieke partijen, inclusief reacties van de betreffende partijen. Je leest het artikel <a href="https://www.ftm.nl/artikelen/politieke-partijen-online-reclame" target="_blank">hier op FTM.nl</a>.
      </p>
      <h2>Hoeveel geld besteden politieke partijen aan online advertenties?</h2>
       <p>
        In de animatie hieronder kun je zien hoeveel geld er per dag wordt uitgegeven aan online advertenties. In de tijdlijn onder de grafiek staan de blauwe rondjes voor politieke gebeurtenissen, zodat je kunt zien wat de invloed hiervan is op de uitgaven.
      </p>
      <BarChartRace class="marge" v-if="dayData.length > 0 && eventData.length > 0" :dayData="dayData" :eventData="eventData"/>
      <p>
        Door de tijdlijn kun je zien dat het opstappen van Thierry Baudet direct invloed heeft gehad op de uitgaven van Forum voor Democratie. Kort voordat hij bekend maakt te stoppen als lijstrekker, stoppen tevens de uitgaven aan online advertenties. Pas enige dagen nadat Thierry Baudet bekend maakt toch weer verder te gaan als lijstrekker, op 8 december, start Forum voor Democratie weer met het lanceren van (nieuwe) advertentiecampagnes.  
      </p>
      <h2>Hoeveel geld besteden partijen aan targetting op leeftijdsgroepen?</h2>
      <p>
        Een van de voordelen voor politieke partijen aan het online adverteren op de platformen van Google en Facebook is dat er gerichte targetting mogelijk is. Zo kunnen partijen hun advertenties bijvoorbeeld richten op een specifieke leeftijdsgroep. Hieronder kun je de targetting van twee politieke partijen met elkaar vergelijken. Soms target een partij sterk op een bepaalde leeftijdsgroep, maar spendeert het toch in verhouding met een andere partij een stuk minder geld.  
      </p>
      <StackedBarChart class="marge" v-if="dayData.length > 0 && targetData.length > 0" :dayData="dayData" :targetData="targetData"/>
      <p>
        Met deze data kun je duidelijk zien dat 50Plus haar naam eer aan doet. Zo'n 80% van het advertentiebudget gaat naar de targetting van de doelgroep 65+. Het overige deel wordt besteed aan de doelgroep 55 tot 64 jarigen. Er wordt geen geld besteed aan het targetten van andere leeftijden.  
      </p>
      <h2>Hoe targetten partijen op provincie, leeftijd en gender?</h2>
       <p>
        Naast het kunnen targetten op leeftijdsgroep, kunnen de politieke partijen hun advertenties nog specifieker targetten op andere factoren. Zo is het ook mogelijk om een advertentie te richten op een bepaalde provincie en op het geslacht van een gebruiker. Hieronder kun je een provincie selecteren om vervolgens te zien in welke mate politieke partijen targetten op een specifieke leeftijdsgroep en hoe dat verdeeld is tussen mannelijke en vrouwelijke gebruikers in die provincie. Het geslacht "onbekend" is buiten beschouwing gelaten, gezien slechts een zeer klein percentage van de totale hoeveelheid weergaven naar deze doelgroep gaat.   
      </p>
      <MapBar class="marge" v-if="targetData.length > 0" :targetData="targetData"/>
      <p>
        Opvallend aan de bovenstaande data is dat GroenLinks en Partij voor de Dieren hun advertenties consistent meer targetten op vrouwen dan op mannen. Daarnaast is bij partijen de provincie Zeeland het minst populair om een advertentie op te targetten. 
      </p>
      <h2>Wat staat er in de meest populaire advertenties?</h2>
       <p>
        We hebben kunnen zien hoeveel geld de politieke partijen besteden aan online advertenties en hoe ze die advertenties kunnen targetten op specifieke doelgroepen. Maar wat is eigenlijk de inhoud van de advertenties die de partijen op Facebook en Google verspreiden? Hieronder zie je een overzicht van de meest populaire advertenties: 
       </p>
       <div class="icon">
          <img src="https://www.ftm.nl/assets/img/icon-investigate.svg?v2146" alt="Follow the Money">
          <p>Platform voor onderzoeksjournalistiek</p>
       </div>
  </div>
  <footer>
    <img class="logo" src="@/assets/wordmark.png" alt="Follow the Money">
    <p>Bron data:</p>
    <p>Google en Facebook (2020-2021)</p>
    <p>Ontwikkeld door:</p>
    <p> Alessandro Nedissa, Tijs van der Linden, Mohamed Lamarti en Lars Ruijs</p> 
  </footer>
</template>

<script>
// @ is an alias to /src
import BarChartRace from '@/components/BarChartRace.vue'
import StackedBarChart from '@/components/StackedBarChart.vue'
import MapBar from '@/components/MapBar.vue'


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
    StackedBarChart,
    MapBar
  }
}
</script>

<style scoped>
  .marge {
    margin: 2em 0;
  }
</style>