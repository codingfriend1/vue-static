const path = require("path");

const site_url = "https://yoursite.netlify.com";

module.exports = {
  /**
   * To choose a theme, type in the foldername of the theme you wish to use in the themes folder.
   */
  theme: "demo-theme",

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
  googleSiteVerification: "",
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
      path: "/:page?",
      component: "page"
    },
    {
      path: "/articles/:article?",
      component: "post"
    },
    {
      path: "/404",
      component: "missing"
    },
    { path: "*", redirect: "/404" }
  ],

  /**
   * Data that will be available across all your templates
   */
  store: {
    file: {},
    files: [],
    social_url: site_url
  }
};
