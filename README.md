# Vue Static

A Vue version of React Static by Nozzle.io

### How to start

Run

```
yarn install
yarn start
```

Open `localhost:3000`

### To do a production build

Run

```bash
yarn build
yarn serve
```

Contents are in `dist` folder.

### You can deploy to netlify quickly

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/codingfriend1/vue-static)

## How it works

The concepts are simple.

We collect all the data from your markdown files, render them to html, and provide them to your vue components in the store as a `files` array, sorted by date created, using [vue-stash](https://github.com/cklmercer/vue-stash). You then have access to render this data in your templates.

Each file look like this:

```js
{
  title: 'Sample Post #2',
  thumbnail: '/uploads/image2.jpg',
  isEmpty: false,
  excerpt: '',
  updated: "2018-07-14T17:49:36.883Z",
  created: "2018-07-11T21:24:28.844Z",
  url: '/articles/second',
  description: '...',
  wordCount: 35,
  readingTime: 0,
  html: '<h1>This is sample post #2.</h1>\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci laborum, doloremque. Repellat sapiente incidunt voluptas, placeat. Nam consectetur maxime eaque magnam nostrum, iste voluptates facilis! Quidem sequi itaque eveniet nesciunt.</p>'
}
```

1.  `html` contains the markdown rendered to a html string
2.  `url` is the folder path inside the templates folder or the url meta information provided in the file.
3.  `updated` is the date of the last time the file was modified
4.  `created` is the birthdate of the file or date it was created
5.  `wordCount` A close estimate of the number of visible words in the markdown file.
6.  `readingTime` At a rate of 275 wpm, how long it would take to read the article, rounded.
7.  Any other information you add to the file's meta will also be in the object, including the title.

In the `site.config.js` you define which routes use which templates (use the string component filename instead of the actual imported component).

```js
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
];
```

You also declare which route a markdown file wants either by:

1.  it's relative folder structure within the `markdown` folder. Ex: articles > second.md === '/articles/second'
2.  or specifying a `url` param in the markdown meta.

```markdown
---
url: '/website/url'
draft: false
created: "2018-07-11T21:24:28.844Z"
---
```

When you're finished run build and it will make a static site of plain html files for good SEO but also with vue router and client side code. This means initial load has good SEO and navigation is super quick.

_NOTE: Markdown files with `draft: true` will be password protected. You can instead prevent them from being rendered at all in the `the-magic/build/render-markdown.js` file._

```js
/**
 * If you don't want to even write files that are in draft mode uncomment this snippet and comment the one below
 */
// if (!fileInfo.draft || process.env.NODE_ENV !== 'production') {
// files.push(fileInfo);
// }

/**
 * Leave line unmodifed if you wish to allow certain users with a password to see draft files.
 */
files.push(fileInfo);
```

### Markdown Editor

This repo is setup to work with Netlify CMS. You have to enable identity service and make an api gateway access code to allow netlify to edit your git files.

Services > Git Gateway

You can access the CMS at `yoursite.com/admin` and log in.

When you get the invite and click on the link the email it will redirect you to your site with an identity token. Something like:

```
...com#invite_token=1212094019284
```

You have to add admin in front of it for it to work

```
...com/admin#invite_token=1212094019284
```

If you are looking for a good markdown editor for mac, I recommend [Typora](https://typora.io/). Just point it to your markdown folder and you'll be able to edit your files. You can also stylize the css to match your site.

### Site Config

In the `site.config.js` in the root of the repo you can add information to use across the site anywhere where you import `config`:

```js
import config from "config";
```

```js
{

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
    components: 'src/templates',

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

  // Default store
  store: {
    file: {},
    files: []
  },

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
  googleAnalyticsId: ""
}
```

You can have any folder structure you want as long as you specify where your entry files are in `site.config.js` > `folderStructure`.

### sitemap.xml and feed.xml

A sitemap.xml and feed.xml is created when running `yarn build` and includes all files that do NOT have 

```md
silent: true
```

#### Static Folder

The contents of the `static` folder will be copied directly as is to the output folder during build and development.

When you run

```
npm run optimize
```

images in the designated images folder will be optimized by `the-magic/commands/optimize-images.js` and saved to the designated static folder.

### Article excerpts

A utility function in `render-markdown.js` exists that will take all the content before the first `<!-- more -->` comment and make everything before it the article excerpt:

```html
<!-- more -->
```

#### Aliases

I've setup a couple handy aliases in webpack so that instead of having to write the relative path when requiring the `site.config.js` or the `theme` folder you can type the alias.

1.  `config` - `site.config.js`
2.  `templates` - An alias to `src/templates`
3.  `src` - An alias to the root src folder
4.  `static` - An alias to `src/static`

### Image Compression
optimize-images.js will reduce your image sizes. Drag the files you wish to reduce into the designated images folder. Run:

```bash
npm run optimize
```

The compressed jpegs, pngs and webp images will be output to the designated static folder with the same filenames and relative paths. You can change this setting and compression levels in the `optimize-images.js` file.

## License

Copyright (c) Jon Paul Miles 2018

Licensed under the [MIT license](LICENSE).