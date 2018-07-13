<template lang="pug">
  div(v-if="ready")
    section.like-and-share
      h4.text-center Do you like this article? Let us know
      .text-center
          .fb-like(:data-href="social_url", data-layout='button_count', data-action='like', data-size='large', data-show-faces='true', data-share='true')
    section.comment
      h3 Join the conversation
      .fb-comments(:data-href="social_url" data-numposts="5" data-width="100%")
</template>

<script>
  export default {
    name: "comment",
    store: ['social_url'],
    data() {
      return {
        ready: false
      }
    },
    mounted() {
      setTimeout(() => {
        this.ready = true
      }, 500);
    }
  }
</script>