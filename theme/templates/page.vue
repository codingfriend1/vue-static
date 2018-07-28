<template lang="pug">
  main.post-content.page
    header.post-header
      h1.post-title {{file.title}}
    div.post-body.post-body-and-feedback(v-html="file.html")
    ul
      li(v-for="user in users" :key="user.login.uuid") {{user.name.first}}
</template>

<script>
const config = require('config')
const Vue = require('vue')
module.exports = {
  store: ["file", "users"],

  /**
   * Async Data Example
   */
  // asyncData({ store, route }) {
  //   return new Promise((resolve, reject) => {
  //     fetch('https://randomuser.me/api/', {
  //       method: 'get'
  //     })
  //       .then(result => result.json())
  //       .then(result => {
  //         Vue.set(store, 'users', result.results)
  //         resolve(result.results)
  //       })
  //       .catch(reject);
  //   })
  // },
  
  metaInfo() {
    return this.file
      ? {
          title: this.file.title,
          link: [
            { rel: 'canonical', href: config.site_url + this.file.url }
          ],
          meta: [
            { "data-vmid": "og:type", property: "og:type", content: "page" },

            { "data-vmid": "url", name: "url", content: config.site_url + this.file.url },
            { "data-vmid": "identifier-URL", name: "identifier-URL", content: config.site_url + this.file.url },
            { "data-vmid": "og:url", property: "og:url", content: config.site_url + this.file.url },
            {
              "data-vmid": "og:description", property: "og:description",
              content: this.file.description || config.description
            },
            {
              "data-vmid": "twitter:description", name: "twitter:description",
              content: this.file.description || config.description
            },
            {
              "data-vmid": "description", name: "description",
              content: this.file.description || config.description
            },

            { "data-vmid": "twitter:title", name: "twitter:title", content: this.file.title },
            { "data-vmid": "og:title", property: "og:title", content: this.file.title },
            { "data-vmid": "pagename", name: "pagename", content: this.file.title },
            { "data-vmid": "author", name: "author", content: this.file.author || config.author }
          ]
        }
      : {};
  }
};
</script>
