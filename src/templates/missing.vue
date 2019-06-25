<template lang="pug">
  main.post-content.page
    div.post-body.post-body-and-feedback(v-html="file.html")
</template>

<script>
export default {
  store: ['file'],
  metaInfo() {
    return {
      meta: [
        { "data-vmid": "robots", name: "robots", content: "noindex" },
        { "data-vmid": "googlebot", name: "googlebot", content: "noindex" }
      ]
    }
  }
}
</script>