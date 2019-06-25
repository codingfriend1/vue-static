<template lang="pug">
  div
    div(v-if="commentsEnabled" role="article")
      section.like-and-share
        h4.text-center Do you like this article? Let us know
        .text-center
          .fb-like(:data-href="social_url", data-layout='button_count', data-action='like', data-size='large', data-show-faces='true', data-share='true')
      section.comment
        h3 Join the conversation
        .fb-comments(:data-href="social_url" data-numposts="5" data-width="100%")
    div(v-else).text-center
      .button(@click="loadComments") Load comments
</template>

<script>
import config from 'config'
export default {
  name: "comment",
  store: ['file', 'social_url', 'commentsEnabled'],
  methods: {
    loadComments() {
      window.enableComments()
      this.commentsEnabled = true;
      setTimeout(() => {
        if (window.fbAsyncInit) {
          window.fbAsyncInit();
        }
      }, 100);
    }
  },
  updated() {
    if(this.commentsEnabled) {
      if (window.fbAsyncInit) {
        window.fbAsyncInit();
      }
    }
  },
  mounted() {
    if(this.commentsEnabled) {
      setTimeout(() => {
        if (window.fbAsyncInit) {
          window.fbAsyncInit();
        }
      }, 250);
    }
  }
}
</script>