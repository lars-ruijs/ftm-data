<template>
      <div id="barchartdiv">
          <button class="controls red button">Pauzeer</button>
      </div>
</template>

<script>
import * as d3 from "d3";
import { sliderBottom } from "d3-simple-slider";

export default {
  name: 'BarChartRace',
  props: {
        dayData: {
            type: Array,
            required: true
        },
  },
  data() {
    return {
      width: 0,
    };
  },
  created() {
        window.addEventListener('resize', this.resize);
        this.resize();
    },
    unmounted() {
        window.removeEventListener('resize', this.resize);
    },
  mounted() {
        // Build the Pie chart with the buildPieChart-function when element gets mounted
        this.makeBarChart();
  },
  methods: {
    
    resize() {
        if (window.innerWidth >= 1165) {
            this.width = 700;
            return 700;
        }
        else if (window.innerWidth < 1165 && window.innerWidth > 860) {
            this.width = 500;
            return 500;
        }
        else {
            this.width = 300;
            return 300;
        }
    },
      
    async makeBarChart() {

        // d.value === d.midden
        // d.name === d.partij
        // d.date === d.datum
    console.log("TOP OF FUNCTION");
        const vm = this;

    //The data
    const data = this.dayData;
    console.log("DATA", data);

    // Unique political party names
    const partijen = new Set(data.map(d => d.partij))

    // Spending per unique date per political party
    const datevalues = Array.from(d3.rollup(data, ([d]) => d.midden, d => d.datum, d => d.partij))
      .map(([date, data]) => [new Date(date), data])
      .sort(([a], [b]) => d3.ascending(a, b));

    // Display settings
    const margin = ({top: 16, right: 80, bottom: 6, left: 0})
    const barSize = 40
    
    // Maximum number of bars
    const n = 13
    // Speed between dates displayed
    const k = 0.8
    // Duration between keyframes
    const duration = 350

    //const width = 700;
    const height = margin.top + barSize * n + margin.bottom

    const locale = d3.formatLocale({
        "decimal": ",",
        "thousands": ".",
        "grouping": [3],
        "currency": ["€", ""]
    })

    const formatNumber = locale.format(",d")
    function euroFormat(d) { return '€' + locale.format(",d")(d) }

    const lokaal = d3.timeFormatLocale({
        "dateTime": "%a %b %e %X %Y",
        "date": "%m/%d/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
        "shortDays": ["zo", "ma", "di", "wo", "do", "vr", "za"],
        "months": ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
        "shortMonths": ["jan", "feb", "maa", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
    })

    const formatDate = lokaal.utcFormat("%d %B %Y")

    // Appending SVG element to div
    const svg = d3.select("#barchartdiv")
            .append("svg")
                .attr("width", this.width)
                .attr("height", height)
                .attr('class', 'barchart')

    // Setting X & Y scales
    const x = d3.scaleLinear([0, 1], [margin.left, this.width - margin.right]);
    const y = d3.scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
    .padding(0.1);

    console.log(n, k, duration, partijen, datevalues);
    console.log(height);
    console.log(x);
    console.log(y);

    function rank(value) {
        const data = Array.from(partijen, partij => ({partij, midden: value(partij)}));
        data.sort((a, b) => d3.descending(a.midden, b.midden));
        for (let i = 0; i < data.length; ++i) data[i].ranking = Math.min(n, i);
        return data;
    }

    const keyframes = [];
    let ka, a, kb, b;
    for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
        for (let i = 0; i <= k; ++i) {
        const t = i / k;
        keyframes.push([
            new Date(ka * (1 - t) + kb * t),
            rank(partij => (a.get(partij) || 0) * (1 - t) + (b.get(partij) || 0) * t)
        ]);
        }
    }
    console.log("KEYFRAMES VAR", keyframes);

    const nameframes = d3.groups(keyframes.flatMap(([, data]) => data), d => d.partij);
    console.log("NAMEFRAMES", nameframes);

    const prev = new Map(nameframes.flatMap(([, data]) => d3.pairs(data, (a, b) => [b, a])));
    console.log("PREV", prev);

    const next = new Map(nameframes.flatMap(([, data]) => d3.pairs(data)));
    console.log("NEXT", next);

//      // Time
//   var dataTime = d3.range(0, 10).map(function(d) {
//     return new Date(1995 + d, 10, 3);
//   });

    const datums = new Set(data.map(d => d.maand))
    console.log(datums);

    var dataDates = [...datums].map(function(d) {
    return new Date(d);
  });
    
    console.log(dataDates);

 var sliderStep =
    sliderBottom()
    .min(0)
    .max((keyframes.length) - 1)
    .width(this.width-margin.right+30)
    .step(1)
    .on('drag', () => {svg.interrupt()})
    .on('end', val => {
        render(val);
    });

  var gStep = d3
    .select('#barchartdiv')
    .append('svg')
    .attr('width', this.width)
    .attr('height', 30)
    .attr('class', 'frameslider')
    .append('g')
    .attr('transform', 'translate(30,10)');

  gStep.call(sliderStep);

    function axis(svg) {
        const g = svg.append("g")
            .attr("transform", `translate(0,${margin.top})`);

        const axis = d3.axisTop(x)
            .tickFormat(euroFormat)
            .ticks(vm.width / 160)
            .tickSizeOuter(0)
            .tickSizeInner(-barSize * (n + y.padding()));

        return (_, transition) => {
            g.transition(transition).call(axis);
            g.select(".tick:first-of-type text").remove();
            g.selectAll(".tick line").attr("stroke", "white");
            g.select(".domain").remove();
        };
    }

    console.log("AXIS", axis);

    // Keyframes 0 0 is the first date
    function ticker(svg) {
        const nu = svg.append("text")
            .style("font", `bold 1em var(--ftm-graph)`)
            .style("font-variant-numeric", "tabular-nums")
            .attr("text-anchor", "end")
            .attr("x", vm.width - 6)
            .attr("y", margin.top + barSize * (n - 0.45))
            .attr("dy", "0.32em")
            .text(formatDate(keyframes[0][0]));

        return ([date], transition) => {
            //console.log("DATE", date);
            transition.end().then(() => nu.text(formatDate(date)));
        };
    }

   console.log("AXIS-TICK", axis, ticker);

    function color(party) {
        let color = "";
        switch(party) {
            case "D66":
                color = "#B2DF8A";                
            break;
            case "Forum voor Democratie":
            case "FvD":
                color = "#9C1616";                
            break;
            case "VVD":
                color = "#FA9600";                
            break;
            case "GroenLinks":
                color = "#43B825";                
            break;
            case "CDA":
                color = "#438A69";                
            break;
            case "PvdA":
                color = "#FB9B98";                
            break;
            case "SP":
                color = "#DC3230";                
            break;
            case "PvdD":
                color = "#B15929";                
            break;
            case "SGP":
                color = "#F0F025";                
            break;
            case "DENK":
                color = "#53C5C9";                
            break;
            case "CU":
            case "Christen Unie":
            case "ChristenUnie":
                color = "#1F78B4";                
            break;
            case "50 Plus":
            case "50Plus":
                color = "#972EBA";                
            break;
            case "PVV":
                color = "#88C6C1";                
            break;
        }
    return color;
    }

    function bars(svg) {
        let bar = svg.append("g")
            .selectAll("rect");

        return ([, data], transition) => bar = bar
        
            .data(data.slice(0, n), d => d.partij)
            .join(
            enter => enter.append("rect")
                .attr("fill", d => color(d.partij))
                .attr("height", y.bandwidth())
                .attr("x", x(0))
                .attr("y", d => y((prev.get(d) || d).ranking))
                .attr("width", d => x((prev.get(d) || d).midden) - x(0)),
            update => update,
            exit => exit.transition(transition).remove()
                .attr("y", d => y((next.get(d) || d).ranking))
                .attr("width", d => x((next.get(d) || d).midden) - x(0))
            )
            .call(bar => bar.transition(transition)
            .attr("y", d => y(d.ranking))
            .attr("width", d => x(d.midden) - x(0)))
    }

    console.log("BARS", bars(svg));

    function textTween(a, b) {
        const i = d3.interpolateNumber(a, b);
        return function(t) {
            this.textContent = "€" + formatNumber(i(t));
        };
    }

    console.log("TEXTTWEEN", textTween(34, 66));
    console.log("FORMAT", formatNumber(3400));
    console.log("FORMAT-EU", euroFormat(3400));



    function labels(svg) {
        let label = svg.append("g")
            .style("font", "bold 12px var(--ftm-graph)")
            .style("font-variant-numeric", "tabular-nums")
            .attr("text-anchor", "start")
            .selectAll("text");

        return ([, data], transition) => label = label
            .data(data.slice(0, n), d => d.partij)
            .join(
            enter => enter.append("text")
                .attr("transform", d => `translate(${x((prev.get(d) || d).midden)},${y((prev.get(d) || d).ranking)})`)
                .attr("y", y.bandwidth() / 2)
                .attr("x", 10)
                .attr("dy", "-0.25em")
                .text(d => d.partij)
                .call(text => text.append("tspan")
                .attr("fill-opacity", 0.7)
                .attr("font-weight", "normal")
                .attr("x", 10)
                .attr("dy", "1.15em")),
            update => update,
            exit => exit.transition(transition).remove()
                .attr("transform", d => `translate(${x((next.get(d) || d).midden)},${y((next.get(d) || d).ranking)})`)
                .call(g => g.select("tspan").tween("text", d => textTween(d.midden, (next.get(d) || d).midden)))
            )
            .call(bar => bar.transition(transition)
            .attr("transform", d => `translate(${x(d.midden)},${y(d.ranking)})`)
            .call(g => g.select("tspan").tween("text", d => textTween((prev.get(d) || d).midden, d.midden))))
    }

    console.log("LABELS", labels(svg));

    d3.select("button").on("click", function() {
    if (this.innerHTML === "Pauzeer") {
        this.innerHTML = "Hervat";
        stop();
    } else if (this.innerHTML === "Hervat") {
        this.innerHTML = "Pauzeer";
        start();
    } else {
        this.innerHTML = "Pauzeer";
        console.log(0);
        render();
    }
    });

    let elapsedTime = duration;
    let currentDataSetIndex = 0;

    function stop() {
        console.log("STOP");
        svg.interrupt();
    }

    function start() {
        render(currentDataSetIndex);
        console.log("START");
    }

    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg);
    const updateTicker = ticker(svg);

    render(0)

    console.log("KEFRAME LENG", keyframes.length);

    async function render(index = 0) {

    console.log("INDEX", index);

    currentDataSetIndex = index;

    const transition = svg.transition()
      .transition()
      .duration(elapsedTime)
      .ease(d3.easeSinInOut)
      .on("end", () => {
        if (index < keyframes.length) {
          elapsedTime = duration;
          d3.select(".controls").text("Pauzeer");
          render(index + 1);
        } else {
          d3.select(".controls").text("Afspelen");
        }
      })
      .on("interrupt", () => {
          console.log("INTERUPTED");
      });
    
        if (index < keyframes.length) { 
            sliderStep.value(index)
            x.domain([0, keyframes[index][1][0].midden]);
            updateAxis(keyframes[index], transition);
            updateBars(keyframes[index], transition);
            updateLabels(keyframes[index], transition);
            updateTicker(keyframes[index], transition);
        }

    await transition.end().then(() => {//console.log("ENDED")
    })


    // //var moving = false;
    // var currentValue = 0;
    // var targetValue = 500;

    // //var playButton = d3.select("#play-button");
        
    // var xScale = d3.scaleTime()
    //     .domain([keyframes[0][0], keyframes[keyframes.length - 1][0]])
    //     .range([0, targetValue])
    //     .clamp(true);

    // var slider = svg.append("g")
    //     .attr("class", "slider")
    //     .attr("transform", "translate(" + margin.left + "," + height/5 + ")");

    // slider.append("line")
    //     .attr("class", "track")
    //     .attr("x1", xScale.range()[0])
    //     .attr("x2", xScale.range()[1])
    // .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    //     .attr("class", "track-inset")
    // .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    //     .attr("class", "track-overlay")
    //     .call(d3.drag()
    //         .on("start.interrupt", function() { slider.interrupt(); })
    //         .on("start drag", function() {
    //         currentValue = d3.event.x;
    //         console.log(currentValue);
    //         //update(x.invert(currentValue)); 
    //         })
    //     );

    // slider.insert("g", ".track-overlay")
    //     .attr("class", "ticks")
    //     .attr("transform", "translate(0," + 18 + ")")
    // .selectAll("text")
    //     .data(xScale.ticks(10))
    //     .enter()
    //     .append("text")
    //     .attr("x", xScale)
    //     .attr("y", 10)
    //     .attr("text-anchor", "middle")
    //     .text(function(d) { return formatDate(d); });

    // slider.insert("circle", ".track-overlay")
    //     .attr("class", "handle")
    //     .attr("r", 9);

    // slider.append("text")  
    //     .attr("class", "label")
    //     .attr("text-anchor", "middle")
    //     .text(formatDate(keyframes[0][0]))
    //     .attr("transform", "translate(0," + (-25) + ")")

  }


// maak();

//     function maak(index = 0){
//         currentDataSetIndex = index;
//         timerStart = d3.now();

//         for (const frame in keyframes) {
//         const transition = svg.transition()
//             .duration(elapsedTime)
//             .ease(d3.easeLinear)
//             .on("end", () => {
//             if (frame < keyframes.length) {
//             currentDataSetIndex + 1;
//             } else {
//             d3.select(".controls").text("Play");
//             }
//             })
//             .on("interrupt", () => {
//             timerEnd = d3.now();
//             });

//             x.domain([0, keyframes[frame][1][0].midden]);

//             if (frame < keyframes.length) {        
//             updateAxis(keyframes[frame], transition);
//             updateBars(keyframes[frame], transition);
//             updateLabels(keyframes[frame], transition);
//             updateTicker(keyframes[frame], transition);
//             }


//     }
// }

    // for (const keyframe of keyframes) {
    //     const transition = svg.transition()
    //         .duration(duration)
    //         .ease(d3.easeLinear);

    //     // Extract the top bar’s value.
    //     x.domain([0, keyframe[1][0].midden]);

    //     // KEYFRAME = Array met datum en rankings
    //     //console.log("KEYFRAME", keyframe)

    //     updateAxis(keyframe, transition);
    //     updateBars(keyframe, transition);
    //     updateLabels(keyframe, transition);
    //     updateTicker(keyframe, transition);

    //     //console.log(keyframe);

    //     await transition.end().then(() => {//console.log("ENDED")
    //     });
    // }


// svg.interrupt()

//     function color() {
//         const scale = d3.scaleOrdinal(d3.schemeTableau10);
//         if (data.some(d => d.category !== undefined)) {
//             const categoryByName = new Map(data.map(d => [d.name, d.category]))
//             scale.domain(Array.from(categoryByName.values()));
//             return d => scale(categoryByName.get(d.name));
//         }
//     return d => scale(d.name);
// }

  }
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
