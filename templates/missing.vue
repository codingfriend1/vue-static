<template lang="pug">
  
  main.post-content.page
    div.post-body.post-body-and-feedback(v-html="file.html")
</template>

<script>
module.exports = {
  store: ['file'],
  metaInfo() {
    return {
      meta: [
        { "data-vmid": "robots", name: "robots", content: "noindex" },
        { "data-vmid": "robots", name: "googlebot", content: "noindex" }
      ]
    }
  }
}
</script>