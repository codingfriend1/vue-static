<template lang="pug">
  footer.site-footer
    | &copy; 
    | #[time(:datetime="year") {{year}}] 
    | #[address #[router-link(to="/about" rel="author") {{author}}]] 
    | {{site_title}}
    div.text-center(style="margin-top: 0.5em;")
      router-link(exact to="/analytics" role="menuitem").no-border Analytics
</template>

<script>
const config = require('config')
module.exports = {
  store: ["files"],
  data() {
    return {
      year: new Date().getFullYear(),
      author: config.author,
      description: config.description,
      site_title: config.site_title
    }
  }
}
</script>