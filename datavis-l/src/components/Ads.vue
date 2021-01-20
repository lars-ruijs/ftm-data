<template> 
    <!-- The code from here is written by my teammate Mohamed Lamarti -->
    <div class="container">
    <div class="item">
        <div class="ad"><img src="@/assets/CDA.png"></div>
        <div class="text">
            <p>>1 mln. weergaven</p>
        </div>
    </div>
    <div class="item">
        <div class="ad"><img src="https://raw.githubusercontent.com/lamartm/FTM/master/advertentie%20ftm/50plus.PNG"></div>
        <div class="text">
            <p>>1 mln. weergaven</p>
        </div>
    </div>
     <div class="item">
        <div class="ad"><img src="https://raw.githubusercontent.com/lamartm/FTM/master/advertentie%20ftm/SGP.PNG"></div>
        <div class="text">
            <p>>1 mln. weergaven</p>
        </div>
    </div>
     <div class="item">
        <div class="ad"><img src="https://raw.githubusercontent.com/lamartm/FTM/master/advertentie%20ftm/FvD.PNG"></div>
        <div class="text">
            <p>>1 mln. weergaven</p>
        </div>
    </div>
    <div class="item">
        <div class="ad"><img src="https://raw.githubusercontent.com/lamartm/FTM/master/advertentie%20ftm/SP.PNG"></div>
        <div class="text">
            <p>500.000 - 1 mln. weergaven</p>
        </div>
    </div>
    <div class="item">
        <div class="ad"><img src="https://raw.githubusercontent.com/lamartm/FTM/master/advertentie%20ftm/Groenlinks.PNG"></div>
        <div class="text">
            <p>500.000 - 1 mln. weergaven</p>
        </div>
    </div>
    <div class="item">
        <div class="ad"><img src="https://raw.githubusercontent.com/lamartm/FTM/master/advertentie%20ftm/DENK.PNG"></div>
        <div class="text">
            <p>100.000 - 500.000 weergaven</p>
        </div>
    </div>
    <div class="item">
        <div class="ad"><img src="https://raw.githubusercontent.com/lamartm/FTM/master/advertentie%20ftm/PvdA.PNG"></div>
        <div class="text">
            <p>50.000 - 100.000 weergaven</p>
        </div>
    </div>
    <div class="item">
        <div class="ad"><img src="https://raw.githubusercontent.com/lamartm/FTM/master/advertentie%20ftm/CU.PNG"></div>
        <div class="text">
            <p>10.000 - 50.000 weergaven</p>
        </div>
    </div>
</div>
</template>

<script>

export default {
  name: 'Ads',
  props: {
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style scoped>
    .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    }
    .item {
        justify-self: center;
        padding-bottom: 2em;
    }
    .ad {
        width: 320px;
        max-height: 100%;
        border: 1px solid rgb(216, 216, 216);
        border-radius: 0.2em;
    }
    img {
        width: 318px;
        max-height: 90%;
    }
    .text {
        height: 70px;
        background-color: #c42b28;
        display: grid;
    }
    .text p {
        font-size: 1em;
        color: white;
        align-self: center;
        text-align: center;
        margin: 0;
        font-family: var(--ftm-graph);
    }
    @media only screen and (max-width: 1000px) {
        .container {
            grid-template-columns: auto;
        }
        .item {
            padding-bottom: 2em;
        }
    }
</style>