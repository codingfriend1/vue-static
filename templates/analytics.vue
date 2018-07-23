<template lang="pug">
div
  div(v-if="hasPermission")
    main(style="width: 100%;")
      article.post-content
        div.post-body-and-feedback(style="padding: 10px;")
          div.post-body(ref="postBody" role="main")
            iframe#iframe(width='100%', height='4300', scrolling="yes", :src="dataStudioEmbedLink", frameborder='0', style='border:0;', allowfullscreen='')

  div(v-else)
    main.post-content-and-feedback(style="width: 100%;")
      header.post-header
        h1.post-title This content is only for admins
      div.post-body-and-feedback
        p
          | Sorry, but this page is only for admins
</template>

<script>
const config = require("config");
module.exports = {
  store: ["file", "files"],
  data() {
    return {
      hasPermission: process.env.NODE_ENV !== 'production',
      dataStudioEmbedLink: config.dataStudioEmbedLink
    }
  },
  metaInfo() {
    let meta = this.file
      ? {
          title: this.file.title,
          meta: [
            { "data-vmid": "robots", name: "robots", content: "noindex" },
            { "data-vmid": "googlebot", name: "googlebot", content: "noindex" }
          ]
        }
      : {};
      return meta
  },
  beforeMount() {
    if(!this.$isServer) {
      if(process.env.NODE_ENV === 'production') {

        // Get the passcode that was previously typed in
        let input = localStorage.getItem('passcode')

        if(input) {
          let now = new Date().getTime()

          let one_day_in_milliseconds = (1000 * 60 * 60 * 24)

          // Set password expiration date to 1 day after it was saved
          let passcode_expiration_date = parseInt(input.substring(input.indexOf(" | ") + 3)) + one_day_in_milliseconds;

          // Check if we're passed the expiration date
          if(now > passcode_expiration_date) {
            // If so, remove the password
            input = ''
            localStorage.setItem('passcode', '')
          } else {
            // Looks like our password hasn't expired, Let's remove the date portion so we are left with just the original password
            input = input.replace(' | ' + input.substring(input.indexOf(" | ") + 3), '')
          }
        }

        // If input doesn't match the file password or the site password, manually request the password just in case the file password has changed since then
        if(input !== this.file.password && input !== config.draft_preview_password) {
          input = window.prompt('Please enter the password to see site metrics: ')

          // Check that the input matches the file or site password
          this.hasPermission = input === this.file.password || input === config.draft_preview_password

          // We only want to save the passcode if it was manually entered, not every time or there would be no point the expiration date
          localStorage.setItem('passcode', input + ' | ' + new Date().getTime())
        }

        // Check if the credentials are correct
        this.hasPermission = input === this.file.password || input === config.draft_preview_password

        // If incorrect, deny permission
        if(!this.hasPermission) {
          window.alert('Sorry but that password was not correct, please visit other pages on the site.')
        }
      }
    }
  }
};
</script>

<style>
</style>
