<template lang="pug">
section
  header.site-header(role='banner').no-print
    .site-image
      .site-meta
        .site-logo
          //- img(:src="logo", alt="")
        h1.site-title
          a(href="#{url}", rel='home') {{site_title}}
        h2.site-description {{description}}
  nav.navigation.no-print
    ul.nav.navbar-nav.navbar-right
      li(:key="page.url", v-for="page in pages")
        router-link(exact :to="page.url").block.no-border {{page.title}}
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
