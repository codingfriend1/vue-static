<template lang="pug">
div
  header.site-header.no-print
    .site-image
      .site-meta
        //- .site-logo
        //-   img(:src="logo", title="Site logo" alt="Site logo")
        h2.site-title
          router-link(to="/", rel='home') {{site_title}}
        p.h3.site-description(role="doc-subtitle") {{description}}
  nav.navigation.no-print
    ul.nav.navbar-nav.navbar-right(role="menubar")
      li(:key="page.url", v-for="page in pages")
        router-link(exact :to="page.url" role="menuitem").block {{page.title}}
</template>

<script>
const config = require('config')
module.exports = {
  store: ["files"],
  data() {
    return {
      logo: config.logo,
      description: config.description,
      site_title: config.site_title
    }
  },
  computed: {
    posts() {
      return this.files.filter(file => file.url.indexOf("articles/") > -1);
    },
    pages() {
      return this.files
        .filter(file => file.url !== "/404")
        .filter(file => file.url.match(/\//g).length === 1);
    }
  }
};
</script>
