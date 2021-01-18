# Visualizing political ad data for Follow the Money

Follow the Money is a Dutch website dedicated to investigative journalism. Follow the Money asked me and my fellow students Alessandro, Tijs and Mohamed to visualize data about political ads on Google (+ Youtube) and Facebook (+ Instagram). These visualizations support the articles the journalists write on this subject and can provide new insights to readers. In particular, Follow the Money would like the visualizations to provide insight into:
- How much parties spend over time;
- Which parties micro-target most strongly;
- Which demographic groups are being targeted;
- The content of the ads. 

The visualizations are placed in an interactive overview, but should also be able to be embedded as individual charts in articles. 

<br>

More information about Follow the Money can be found at the official website [FTM.nl (Dutch)](https://www.ftm.nl/over-ftm).

The data we use for this project is collected and bundled by data journalists from Follow the Money. They use the datasets ["Google Transparency Report on Political ads](https://transparencyreport.google.com/political-ads/region/EU)" and the ["Facebook Ads Library"](https://www.facebook.com/ads/library/?active_status=all&ad_type=political_and_issue_ads&country=NL&sort_data[direction]=desc&sort_data[mode]=relevancy_monthly_grouped).

This project is part of the Information Design semester at CMD Amsterdam.

<br>

## ✨ The product
![ftm-product](https://user-images.githubusercontent.com/60745347/104925692-6db23600-599f-11eb-8754-9fced3d79dc7.jpg)

The result we delivered to Follow the Money is a dashboard in the same style as the research articles they write. The dashboard includes the following visualizations:

- An overview of online political ad spending by party, over time. Linked to key political events, displayed in a timeline. 
- Insight into how much money parties spend on targeted ads for specific age groups. 
- An overview showing what percentage of views per political party are targeted for a specific province, age and gender. 
- A view with screenshots of the most popular ads by political party. 

The graphs are rendered based on the user's screen size. As a result, the graphs are also easy to use on tablets and smartphones. 
> [**View the project here.**](https://dashboard-politieke-advertenties.netlify.app/#/) 

<br>

## 📊 Data used
The data we used for this dashboard was collected and compiled by data journalists at Follow the Money. This ensures that the complex calculations for amounts spent and target groups are correct. Below is a brief overview of the data used: 

**From dataset "Dag dashboard":**
<br>
- `datum` contains the date of the spended amount. Formated as YYYYMMDD. <br> _Example output: `"2020-09-04"`;_ <br><br>
- `partij` contains the name of the political party. <br> _Example output: `"GroenLinks"`;_ <br><br>
- `midden` returns the cumulative average amount spent to date on online ads on both Google and Facebook. <br> _Example output: `"25287"`;_ <br><br>

**From dataset "Fb target dashboard":**
<br>
- `partij` contains the name of the political party. <br> _Example output: `"GroenLinks"`;_ <br><br>
- `age` specifies an age group that the ad is targeted to. <br> _Example output: `"25-34"`;_ <br><br>
- `gender` specifies the gender that the ad is targeted to. <br> _Example output: `"man"`;_ <br><br>
- `geo` specifies the province that the ad is targeted to. <br> _Example output: `"Noord-Holland"`;_ <br><br>
- `percentage geslacht/leeftijd` gives the percentage of the views that go to the specified age group and gender. <br> _Example output: `"12,8"`;_ <br><br>
- `percentage totaal` gives the percentage of the views that go to the specified age group, gender and province. <br> _Example output: `"1,2"`;_ <br><br>

**From dataset "Gebeurtenissen":**
<br>
This dataset was compiled by ourselves for the purpose of showing political events in a timeline. The data was collected using the Dutch political news archives of NOS.nl and NU.nl. We provide Follow the Money journalists with access to this dataset so they can add new events and change existing ones themselves. 
<br>
- `datum` contains the date of the event. Formated as YYYYMMDD. <br> _Example output: `"2020-09-04"`;_ <br><br>
- `gebeurtenis` specifies a short description of the event. <br> _Example output: `"Kabinet Rutte-III gevallen"`;_ <br><br>
- `partij` contains the name of the political party (if applicable). <br> _Example output: `"GroenLinks"`;_ <br><br>

<br>

## 🛠 Tools used
For this project, we used the following libraries, frameworks, etc. 

- **Vue**, a front-end framework that allows us to easily work in components and structure our code accordingly. 
- **Vue router**, a router for Vue that allows us to give each graph its own view (url), so that the graphs can be easily embedded in Follow the Money articles (without also embedding the redundant text). 
- **D3**, a JavaScript library for creating data visualizations using SVG elements. 
- **D3-simple-slider**, a plugin for D3 that allows you to create simple sliders with D3. 
- **Topojson feature**, to convert TopoJSON to GeoJSON (used for creating the map visualization).
- **Netlify**, used for hosting our product. 

<br>

## ⬇️ Install the project
> ⚠️ Please obtain permission from the Follow the Money team about the use of the data and branding assets, before publishing the project online. 

### Clone the repository
```
git clone https://github.com/lars-ruijs/ftm-data.git
```
### Navigate to the repository and install the required packages
```
npm install
```
### Compiles and hot-reloads for development
```
npm run serve
``` 
### Compile and minify for production
```
npm run build
```

## 🔗 Sources
To be updated.
