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
    "themes",
    config.theme,
    "_index.html"
  )
};

const sitemap_template = `<?xml version="1.0" encoding="utf-8" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
<!-- Urls will be auto injected -->
</urlset>`;

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
    if (!file || file.draft) {
      return;
    }

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
        "<title></title>",
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
});
