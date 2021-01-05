<template>
  <!-- <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div> -->
  <router-view/>
</template>

<style>
/* Import external fonts:
   Page titles: 'Open Sans Condensed', sans-serif
   Page body: 'PT Serif', serif;
   Graph text: 'PT Sans', sans-serif;
*/

@import url('https://fonts.googleapis.com/css2?family=Open+Sans+Condensed:wght@700&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap');

:root {
  --body-color: #000000;
  --link-color: #39b2b1;
  --ftm-red: #dd3230;
  --ftm-grey: #f6f6f6;
  --ftm-blue: #d1e8ea;
  --ftm-title: 'Open Sans Condensed', sans-serif;
  --ftm-body: 'PT Serif', serif;
  --ftm-graph: 'PT Sans', sans-serif;  
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

h1, h2, h3 {
  font-family: var(--ftm-title);
  color: var(--body-color);
  line-height: 1.2em;
}

h1 {
  font-size: 3em;
  margin: 1em 0;
}

.home h1:first-child {
  margin-top: 3em;
}

p {
  font-family: var(--ftm-body);
  color: var(--body-color);
  margin: 1em 0;
}

p.summary {
  font-family: var(--ftm-body);
  font-weight: bold;
}

.home {
  margin: 0 auto;
  width: 50%;
}

.top-bar {
  height: 3.8em;
  width: 100%;
  background-color: #292f32;
  position: fixed;
  top: 0;
}

.top-bar img.eye {
  height: 3.8em;
}
.top-bar img.logo {
  height: 1.5em;
  margin: 0 0 1em 1em;
}

#app {
/* font-family: 'Hanalei Fill', cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; */
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
