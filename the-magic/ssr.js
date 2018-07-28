const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";
const path = require("path");
const url = require("url");
const fs = require("fs");
const { createBundleRenderer } = require("vue-server-renderer");
const mkdirp = require("mkdirp");
const getDirName = require("path").dirname;
const config = require("../site.config");
const getMarkdownFiles = require("./get-files.js");

const rootFolder = path.join(__dirname, "..")

const folders = {
  markdown_folder: path.join(rootFolder, "markdown"),
  output_folder: path.join(rootFolder, "dist"),
  published_html_path: path.join(
    rootFolder,
    "theme",
    "_index.html"
  )
};

const sitemap_template = `<?xml version="1.0" encoding="utf-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- Urls will be auto injected -->
</urlset>`;

const feed_template = `<?xml version="1.0" encoding="utf-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${config.site_title}</title>
    <author>${config.author}</author>
    <link>${config.site_url}</link>
    <description>${config.description}</description>
    <atom:link href="${config.site_url}/feed.xml" rel="self" type="application/rss+xml"></atom:link>
    <!-- Urls will be auto injected -->
  </channel>
</rss>`;

function createFile(url, html) {
  url += !path.extname(url) ? ".html" : "";

  url = path.join(folders.output_folder, url);

  mkdirp(getDirName(url), function(err) {
    if (err) return cb(err);
    fs.writeFile(url, html, err => {
      if (err) {
        return console.log(err);
      }
      console.log(`${url.replace(__dirname, "")} was created.`);
    });
  });
}

const serverBundlePath = path.join(
  folders.output_folder,
  "vue-ssr-server-bundle.json"
);

if (!fs.existsSync(serverBundlePath)) {
  return false
}

const template = fs
  .readFileSync(folders.published_html_path, "utf-8")
  .replace('<div id="app"></div>', "<!--vue-ssr-outlet-->");

let renderer = createBundleRenderer(
  serverBundlePath,
  Object.assign(
    {},
    {
      runInNewContext: true,
      template
    }
  )
);

getMarkdownFiles(folders.markdown_folder).then(files => {
  files.forEach(file => {
    // if (!file || (file.draft && process.env.NODE_ENV === 'production')) {
    //   return;
    // }

    if(!file) { return }

    const context = {
      file,
      files
    };

    renderer.renderToString(context, (err, html) => {
      if (err) {
        console.warn(`Error with SSR`, err);
      }

      const {
        title,
        htmlAttrs,
        bodyAttrs,
        link,
        style,
        script,
        noscript,
        meta
      } = context.meta.inject();

      html = html.replace(
        "<!-- meta tags will be auto injected here -->",
        meta.text() +
          title.text() +
          link.text() +
          style.text() +
          script.text() +
          noscript.text()
      );

      createFile(file.url === "/" ? "/index" : file.url, html);
    });
  });

  let sitemap_string = files
    .filter(file => file.url.indexOf("404") === -1)
    .filter(file => file.url !== "/analytics")
    .map(file => {
      file.url.replace("/(.html$)/", "");
      file.absolute_url = url.resolve(config.site_url, file.url);
      return file;
    })
    .map(file => {
      return `
        <url>
          <loc>${file.absolute_url}</loc>
          <priority>1.0</priority>
          <lastmod>${new Date(file.updated).toISOString()}</lastmod>
        </url>
      `;
    })
    .join("");

  let sitemap_html = sitemap_template.replace(
    "<!-- Urls will be auto injected -->",
    sitemap_string
  );

  createFile("sitemap.xml", sitemap_html);


  let feed_string = files
    .filter(file => file.url.indexOf("404") === -1)
    .map(file => {
      file.absolute_url = url.resolve(config.site_url, file.url).replace("/(.html$)/", "");
      return file;
    })
    .map(file => {
      return `<item>
          <title>${file.title}</title>
          <author>${file.author || config.author}</author>
          <pubdate>${file.created}</pubdate>
          <description>${file.excerpt || config.description}</description>
          <link>${file.absolute_url}</link>
          <guid ispermalink="true">${file.absolute_url}</guid></item>`;
    })
    .join("");

  let feed_xml = feed_template.replace(
    "<!-- Urls will be auto injected -->",
    feed_string
  );

  createFile("feed.xml", feed_xml);
});
