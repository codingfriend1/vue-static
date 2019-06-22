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
  googleAnalyticsId: "UA-57944951-3",
  mailChimpUrl: "",

  /**
   * Tell us where your entry files are located relative to this repository root directory
   */
  folderStructure: {

    /**
     * Show us where your lead js file is that imports all other scripts
     * @type {String}
     */
    js: 'src/js/index.js',

    /**
     * Lead stylus file that imports all other stylesheets
     * @type {String}
     */
    css: 'src/css/index.styl',

    /**
     * Tell us where your root vue component is
     * @type {String}
     */
    vue: 'src/templates/index.vue',

    /**
     * Tell us where your main html template is
     * @type {String}
     */
    html: 'src/index.html',

    /**
     * Tell us what folder we should search in for your larger vue components so we can globalize them
     * @type {String}
     */
    components: 'src',

    /**
     * Tells us what folder your smaller vue components are in
     * @type {String}
     */
    partials: 'src/partials',

    /**
     * Show us what folder we should copy your static assets from
     * This is also the folder that we will save optimized images to
     * @type {String}
     */
    static: 'src/static',

    /**
     * Name of the folder where you will keep fullsized images to be optimized by `npm run optimize`
     * @type {String}
     */
    images: 'unoptimized-images',

    /**
     * Show us what folder you want us to save your generated files in
     * @type {String}
     */
    output: 'dist',

    /**
     * Tells us where your markdown files are
     * @type {String}
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
