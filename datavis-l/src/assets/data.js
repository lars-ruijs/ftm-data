import * as d3 from "d3";

const dayDashboardURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSpwttasVjXReLn69FtOXSrwWxYjKqVSKiRenwS9xU76b_-NX6-YRYfRQEwm0ipV3sLAiNPrCz3uO7D/pub?gid=161211961&single=true&output=csv";

const eventDashboardURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0ispSJft5GVxwMtalNZLqlwrk6j9Ig2azCOlGp0IGfrDbKTFBinaOpgGou1Nyz-_w2-sIqii0_DwK/pub?gid=0&single=true&output=csv"

const targetDashboardURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWbcLP_nYqgbSj8ONiIay7HSmAlW37PMCUFW607PiLilUpPTOYAwzyFEXQOrgUdJwXx6mlaMN9PEvw/pub?gid=1884793021&single=true&output=csv"

async function fetch(url) {
    const data = await d3.csv(url);
    return data;
}

export async function dayData() {
    const dayDashboard = await fetch(dayDashboardURL);
    return dayDashboard;
}

export async function eventData() {
    const eventDashboard = await fetch(eventDashboardURL);
    return eventDashboard;
}

export async function targetData() {
    const targetDashboard = await fetch(targetDashboardURL);
    return targetDashboard;
}

export async function mapGeo() {
    const data = await d3.json("https://cartomap.github.io/nl/wgs84/provincie_2020.topojson");
    return data; 
}