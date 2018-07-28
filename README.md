# Vue Static

A Vue version of React Static by Nozzle.io

### How to start

Run

```
yarn install
yarn start
```

Open `localhost:3000`

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
  readingTime: 'Calculating read time...',
  html: '<h1>This is sample post #2.</h1>\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci laborum, doloremque. Repellat sapiente incidunt voluptas, placeat. Nam consectetur maxime eaque magnam nostrum, iste voluptates facilis! Quidem sequi itaque eveniet nesciunt.</p>',
  description: '...',
  wordCount: 35,
  readingTime: 0
}
```

1.  `html` contains the markdown rendered to html
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

1.  it's relative folder structure within the `markdown` folder
2.  or specifying a `url` param in the markdown meta.

```markdown
---
url: 'my/path/file'
draft: false
---
```

When you're finished run build and it will make a static site of plain html files for good SEO but also with vue router and client side code. This means initial load has good SEO and navigation is super quick.

_NOTE: Markdown files with `draft: true` will be password protected. You can instead prevent them from being rendered at all in the `the-magic/get-files.js` file._

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
const config = require("config");
```

```js
{

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

## The theme folder

The theme folder requires two files:

#### Required Files

1.  `index.js`
2.  `index.template.html`

#### index.template.html

`index.template.html` must contain the comments where you want the rendered and minified scripts and meta tags to be injected.

For scripts:

```html
<!-- Files will be auto injected -->
```

For meta tags:

```html
<!-- meta tags will be auto injected here -->
```

#### index.js

The `index.js` file must export:

```js
module.exports = { app, router, store };
```

See the provided example.

#### Static Folder

The contents of the `static` folder inside the `theme` folder will be copied directly as is to the `dist` folder during build and development.

### Article excerpts

I've created a utility function in `get-files.js` that will take all the content before the first `<!-- more -->` comment and make everything before it the article excerpt:

```html
<!-- more -->
```

#### Aliases

I've setup a few handy aliases in webpack so that instead of having to write the relative path when requiring the `site.config.js` or a file in the `templates` folder you can type the alias.

1.  `config` - `site.config.js`
2.  `theme` - The theme folder

## License

Copyright (c) Jon Paul Miles 2018

Licensed under the [MIT license](LICENSE).
