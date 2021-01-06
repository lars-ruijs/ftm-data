<template>
  <div class="hello">
      <h2>Hallo van Bar chart</h2>
      <h2>Hoi</h2>
      <div id="barchartdiv">
      </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: 'BarChartRace',
  props: {
        dayData: {
            type: Array,
            required: true
        },
  },
  mounted() {
        // Build the Pie chart with the buildPieChart-function when element gets mounted
        this.makeBarChart();
  },
  methods: {
      
    async makeBarChart() {

        // d.value === d.midden
        // d.name === d.partij
        // d.date === d.datum

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
    const margin = ({top: 16, right: 90, bottom: 6, left: 0})
    const barSize = 48
    
    // Maximum number of bars
    const n = 12
    // Speed between dates displayed
    const k = 3
    // Duration between keyframes
    const duration = 100

    const width = 700;
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
                .attr("width", width)
                .attr("height", height)
                .attr('class', 'barchart')

    // Setting X & Y scales
    const x = d3.scaleLinear([0, 1], [margin.left, width - margin.right]);
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

    function axis(svg) {
        const g = svg.append("g")
            .attr("transform", `translate(0,${margin.top})`);

        const axis = d3.axisTop(x)
            .tickFormat(euroFormat)
            .ticks(width / 160)
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

    function ticker(svg) {
        const nu = svg.append("text")
            .style("font", `bold 10px Arial`)
            .style("font-variant-numeric", "tabular-nums")
            .attr("text-anchor", "end")
            .attr("x", width - 6)
            .attr("y", margin.top + barSize * (n - 0.45))
            .attr("dy", "0.32em")
            .text(formatDate(keyframes[0][0]));

        return ([date], transition) => {
            transition.end().then(() => nu.text(formatDate(date)));
        };
    }

   console.log("AXIS-TICK", axis, ticker);

    function color() {
        const scale = d3.scaleOrdinal(d3.schemeTableau10);
        if (data.some(d => d.partij !== undefined)) {
            const categoryByName = new Map(data.map(d => [d.partij, d.partij]))
            scale.domain(Array.from(categoryByName.values()));
            return d => scale(categoryByName.get(d.partij));
        }
    return d => scale(d.partij);
    }

    function bars(svg) {
        let bar = svg.append("g")
            .attr("fill-opacity", 0.6)
            .selectAll("rect");

        return ([, data], transition) => bar = bar
            .data(data.slice(0, n), d => d.partij)
            .join(
            enter => enter.append("rect")
                .attr("fill", color())
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
            .attr("width", d => x(d.midden) - x(0)));
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

    const updateBars = bars(svg);
    const updateAxis = axis(svg);
    const updateLabels = labels(svg);
    const updateTicker = ticker(svg);

    for (const keyframe of keyframes) {
        const transition = svg.transition()
            .duration(duration)
            .ease(d3.easeLinear);

        // Extract the top bar’s value.
        x.domain([0, keyframe[1][0].midden]);

        updateAxis(keyframe, transition);
        updateBars(keyframe, transition);
        updateLabels(keyframe, transition);
        updateTicker(keyframe, transition);

        //console.log(keyframe);

        await transition.end().then(() => {//console.log("ENDED")
        });
    }


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
