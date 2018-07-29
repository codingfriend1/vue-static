<template lang="pug">
div
  header.site-header.no-print(v-show="$route.path !== '/analytics'")
    .site-image
      .site-meta
        //- .site-logo
        //-   picture
        //-     source(:srcset="logo.replace('.png', '.webp')" type="image/webp")
        //-     source(:srcset="logo" type="image/jpeg")
        //-     img(:src="logo", title="" alt="")
        h2.site-title
          router-link(to="/", rel='home') {{site_title}}
        p.h3.site-description(role="doc-subtitle") {{description}}
  nav.navigation.no-print
    ul.nav.navbar-nav.navbar-right(role="menubar")
      li
        router-link(exact to="/" role="menuitem").block Home
      li
        router-link(exact to="/about" role="menuitem").block About
      li
        router-link(exact to="/privacy-policy" role="menuitem").block Privacy Policy
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
