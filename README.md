# Vue Static

A Vue version of React Static by Nozzle.io

### How to start
Run

```
yarn install
yarn start
```

### How it works
Don't worry if it throws an error up front, that's simply because the build commands are async and compile out of their correct order at first. It will correct itself.

The concepts are simple.

We collect all the data from your markdown files, render them to html, and provide them to your vue components in the store as a `files` array using [vue-stash](https://github.com/cklmercer/vue-stash). The one currently being processed is the `file` object. You then have access to render this data in your templates.

Each file look like this:

```js
{
  title: 'About Me',
  content: '# About Me\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora fugiat maiores pariatur omnis blanditiis impedit id a molestiae recusandae quas adipisci voluptates, culpa, quaerat saepe, deleniti labore ex esse.',
  html: '<h1 id="aboutme">About Me</h1>\n<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora fugiat maiores pariatur omnis blanditiis impedit id a molestiae recusandae quas adipisci voluptates, culpa, quaerat saepe, deleniti labore ex esse.</p>',
  excerpt: '',
  url: '/about',
  updated: "2018-07-12T06:37:38.589Z",
  created: "2018-07-12T04:25:36.038Z",
}
```

1.  `content` contains the original markdown
2.  `html` contains the markdown rendered to html
3.  `url` is the folder path inside the templates folder or the url meta information provided in the file.
4.  `updated` is the date of the last time the file was modified
5.  `created` is the birthdate of the file or date it was created
6.  Any other information you add to the file's meta will also be in the object, including the title.

In the `site.config.js` you define which routes use which templates. You also declare which route a markdown file either by it's folder structure or overriding that with a url in the markdown meta.

```markdown
---
url: 'my/path/file'
---
```

When you're finished run build and it will make a static site of plain html files for good SEO but also with vue router and client side code. This means initial load has good SEO and navigation is super quick.

### Markdown Editor

This repo is setup to work with Netlify CMS. You have to enable identity service and make an api gateway access code to allow netlify to edit your git files.

Services > Git Gateway

You can access the CMS at `yoursite.com/admin` and log in.

When you get the invite and click on the link the email it will redirect you to your site with an identity token. Something like:

```
...com#token=1212094019284
```

You have to add admin in front of it for it to work

```
...com/admin#token=1212094019284
```

If you are looking for a good markdown editor for mac, I recommend [Typora](https://typora.io/). Just point it to your markdown folder and you'll be able to edit your files. You can also stylize the css to match your site.

### Site Config

In the `site.config.js` in the root of the repo you can add information to use across the site. There are a few things that are required:

```js
{
  // Which theme to use to render the templates
  theme: "your-theme-folder-name",

  // Default store
  store: {
    file: {},
    files: []
  },

  /**
   * This is where the logic of which markdown files we map to which components goes.
   * If the markdown url matches the route, that component will be rendered.
  **/
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
  ]
}
```

## Building your own themes

If you wish to customize your own theme, create a new folder within the `themes` folder. This new theme folder must contain 2 files:

#### Required Files

1.  `index.js`
2.  `index.template.html`

#### index.template.html

`index.template.html` must contain a comment where you want the rendered and minified scripts to be injected.

```html
<!-- Files will be auto injected -->
```

#### index.js

The `index.js` file must export:

```js
module.exports = { app, router, store };
```

See the demo theme for example.

#### Static Folder

Each theme may have a `static` folder and anything in this folder will be copied to the root of your `dist` folder when everything is compiled, relative paths within the static folder are maintained.

## License

Copyright (c) Jon Paul Miles 2018

Licensed under the [MIT license](LICENSE).
