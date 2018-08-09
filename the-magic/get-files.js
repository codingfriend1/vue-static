const fs = require("fs");
const klaw = require("klaw");
const path = require("path");
const matter = require("gray-matter");
const config = require('../site.config.js')
const Md = require('markdown-it');
const attrs = require('markdown-it-attrs')
const galleryPlugin = require('markdown-it-gallery');

const md = Md({
  html: true,
  linkify: false,
  typographer: false,
  modifyToken: function (token, env) {
    // see API https://markdown-it.github.io/markdown-it/#Token
    // token will also have an attrObj property added for convenience
    // which allows easy get and set of attribute values.
    // It is prepopulated with the current attr values.
    // Values returned in token.attrObj will override existing attr values.
    // env will contain any properties passed to markdown-it's render
    // Token can be modified in place, no return is necessary
    switch (token.type) {
    case 'image':
        token.attrObj['data-src'] = token.attrObj['src'];
        token.attrObj['src'] = "";
      break;
    }
  }
})
  .use(require('markdown-it-modify-token'))
  .use(galleryPlugin, config.markdown_gallery)
  .use(attrs, {
    leftDelimiter: '[',
    rightDelimiter: ']'
  })

/**
 * Capture all text up until the first <!-- more--> comment and make that text both the meta description and the post excerpt, unless the post has an explicit description in the markdown meta.
 */
function excerpt(content) {
  if (content) {
    if (
      content.indexOf("<!-- more-->") == -1 &&
      content.indexOf("<!-- more -->") == -1
    ) {
      return "";
    } else if (content.indexOf("<!-- more-->") > 0) {
      return content.split("<!-- more-->")[0];
    } else if (content.indexOf("<!-- more -->") > 0) {
      return content.split("<!-- more -->")[0];
    }
  } else {
    return content;
  }
}

function get_word_count(html) {
  let words = html.replace(/<[^>]*>/g, " ");
  words = words.replace(/\s+/g, " ");
  words = words.trim();

  return words.split(" ").length;
}

function get_reading_time(word_count) {
  const orientation_seconds = 4;
  const words_per_minute = 275;
  const readable_content = 1;

  const reading_time_in_minutes =
    Math.round(word_count / words_per_minute) * readable_content;

  return reading_time_in_minutes;
}

module.exports = markdown_folder => {
  return new Promise(resolve => {
    let files = [];
    if (fs.existsSync(markdown_folder)) {
      klaw(markdown_folder)
        .on("data", item => {
          // Filter function to retrieve .md files //
          if (path.extname(item.path) === ".md") {
            // If markdown file, read contents //
            const data = fs.readFileSync(item.path, "utf8");
            // Convert to frontmatter object and markdown content //
            let fileInfo = matter(data);
            fileInfo = Object.assign({}, fileInfo.data, fileInfo);

            fileInfo.updated = fileInfo.updated
              ? new Date(fileInfo.updated).toISOString()
              : item.stats.mtime;
            fileInfo.created = fileInfo.created
              ? new Date(fileInfo.created).toISOString()
              : item.stats.birthtime;
            fileInfo.url =
              fileInfo.url ||
              item.path
                .replace(markdown_folder, "")
                .replace(path.extname(item.path), "");

            if (fileInfo.url === "/index") {
              fileInfo.url = "/";
            }

            fileInfo.html = md.render(fileInfo.content);

            fileInfo.wordCount = get_word_count(fileInfo.html);
            fileInfo.readingTime = get_reading_time(fileInfo.wordCount);

            fileInfo.excerpt = md.render(fileInfo.excerpt || excerpt(fileInfo.content))
              .replace(/(<([^>]+)>)/gi, "");
            fileInfo.description =
              fileInfo.description || fileInfo.excerpt.slice(0, 297) + "...";
            delete fileInfo.orig;
            delete fileInfo.data;

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
          }
        })
        .on("error", e => {
          console.log(e);
        })
        .on("end", () => {
          files = files.sort(function(a, b) {
            return new Date(b.created) - new Date(a.created);
          });

          resolve(files);
        });
    } else {
      resolve(files);
    }
  });
};
