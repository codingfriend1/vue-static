const fs = require("fs");
const klaw = require("klaw");
const path = require("path");
const matter = require("gray-matter");
const showdown = require("showdown");
const converter = new showdown.Converter();

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

            fileInfo.html = converter.makeHtml(fileInfo.content);

            fileInfo.wordCount = get_word_count(fileInfo.html);
            fileInfo.readingTime = get_reading_time(fileInfo.wordCount);

            fileInfo.excerpt = converter
              .makeHtml(fileInfo.excerpt || excerpt(fileInfo.content))
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
