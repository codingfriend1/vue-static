const site_url = "https://yoursite.netlify.com";

module.exports = {
  site_title: `Your site title`,
  site_url,
  description: "Your site description",
  author: "You",
  keywords: "",
  medium: "blog",
  language: "English",
  locale: "en_US",
  logo: "/uploads/logo.png",

  twitterCard: "summary_large_image",
  twitterCreator: "@your_twitter_username",

  facebook_id: null,
  googleAnalyticsId: "",
  mailChimpUrl: "",

  /**
   * Tell us where your entry files are located relative to this repository root directory
   */
  folderStructure: {

    /**
     * Show us where your lead js file is that imports all other scripts
     */
    js: 'src/index.js',

    /**
     * Lead stylus file that imports all other stylesheets
     */
    css: 'src/index.styl',

    /**
     * Tell us where your root vue component is
     */
    vue: 'src/index.vue',

    /**
     * Tell us where your main html template is
     */
    html: 'src/index.html',

    /**
     * Tell us what folder we should search in for vue components so we can globalize them
     */
    components: 'src',

    /**
     * Show us what folder we should copy your static assets from
     * @type {String}
     */
    static: 'src/static',

    /**
     * Show us what folder you want us to save your generated files in
     */
    output: 'dist',

    /**
     * Tells us where your markdown files are
     */
    markdown: 'markdown'
  },

  /**
   * For each route, list the url and the template that should be used to render that route
   *
   * Write the name of the .vue file found in your templates folder as the component string
   *
   * The path will attempt to match the natural folder structure of the markdown folder unless you specifically override the path in the url metadata of the markdown file
   */
  routes: [
    {
      path: "/",
      component: "home"
    },
    {
      path: "/404",
      component: "missing"
    },
    {
      path: "/:page?",
      component: "page"
    },
    {
      path: "/articles/:article?",
      component: "post"
    },
    { path: "*", redirect: "/404" }
  ],

  /**
   * Data that will be available across all your templates
   */
  store: {
    file: {},
    files: [],
    social_url: site_url,
    commentsEnabled: false
  },

  /**
   * Based on `markdown-it-gallery`
   */
  markdown_gallery: {
    galleryClass: 'gallery',
    galleryTag: 'div',
    imgClass: 'gallery-image',
    wrapImagesInLinks: true,
    linkClass: 'gallery-link',
    linkTarget: '_blank',
    imgTokenType: 'image',
    linkTokenType: 'link',
    imageFilterFn: token => /galleries\//.test(token.attrGet('src')),
    // imageSrcFn: token => token.attrGet('src').replace(/(\.\w+$)/, '$1'),
    // linkHrefFn: token => token.attrGet('src').replace(/(\.\w+$)/, '$1'),
  }
};
