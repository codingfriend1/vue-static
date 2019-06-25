<template lang="pug">
  footer.site-footer
    | &copy; 
    | #[time(:datetime="year") {{year}}] 
    | #[address #[router-link(to="/about" rel="author") {{author}}]] 
    | {{site_title}}
</template>

<script>
import config from 'config'
export default {
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