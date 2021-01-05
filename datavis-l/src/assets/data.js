import * as d3 from "d3";

const dayDashboard = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSpwttasVjXReLn69FtOXSrwWxYjKqVSKiRenwS9xU76b_-NX6-YRYfRQEwm0ipV3sLAiNPrCz3uO7D/pub?gid=228116080&single=true&output=csv";

export async function hello() {
    const data = await d3.csv(dayDashboard);
    return data;
}