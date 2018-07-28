const site_url = "https://yoursite.netlify.com";

module.exports = {

  /**
   * Gulp will automatically find all your vue templates and globalize them and add links to them to the file path you mention here
   */
  relativePathInThemeToRoutes: 'index.js',

  /**
   * If you type in this password when prompted you may see pages that are in draft mode on the live site.
   */
  draft_preview_password: 'your_global_password_for_viewing_drafts',

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

  facebook_id: 111,
  googleAnalyticsId: "",
  mailChimpUrl: "",

  /**
   * For each route list the url and the template that should be used to render that route
   *
   * Use the `file name` of the component found in your templates folder for the route component without the path or extension
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
    {
      path: "/blog/:article?",
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
  }
};
