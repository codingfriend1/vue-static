const fs = require("fs");
const klaw = require("klaw");
const path = require("path");
const matter = require("gray-matter");
const MarkDownIt = require('markdown-it');
const galleryPlugin = require('markdown-it-gallery');
const config = require('../../site.config.js');
const attrs = require('markdown-it-attrs');
const markdown_folder = path.join(__dirname, '..', '..', "markdown");
const colors = require('colors');
 
const md = MarkDownIt({
  html: true,
  linkify: false,
  typographer: false,
  // modifyToken: function (token, env) {
  //   // see API https://markdown-it.github.io/markdown-it/#Token
  //   // token will also have an attrObj property added for convenience
  //   // which allows easy get and set of attribute values.
  //   // It is prepopulated with the current attr values.
  //   // Values returned in token.attrObj will override existing attr values.
  //   // env will contain any properties passed to markdown-it's render
  //   // Token can be modified in place, no return is necessary
  //   switch (token.type) {
  //   case 'image':
  //       token.attrObj['data-src'] = token.attrObj['src'];
  //       token.attrObj['src'] = "";
  //     break;
  //   }
  // }
})
  .use(attrs)
  .use(require('markdown-it-modify-token'))
  .use(galleryPlugin, config.markdown_gallery)


/**
 * Retrieves all the text prior to the first <!-- more --> html comment.
 * Is used to create a summary of the article for SEO purposes and preview during navigation
 * @param {string} content A string containing raw markdown text
 * @return {string} The text before the first html 'more' comment
 */
function excerpt(content) {
  if(content) {
    if(content.indexOf("<!-- more-->") == -1 && content.indexOf("<!-- more -->") == -1) {
      return "";
    } else if(content.indexOf("<!-- more-->") > 0) {
      return content.split("<!-- more-->")[0];
    } else if(content.indexOf("<!-- more -->") > 0) {
      return content.split("<!-- more -->")[0];
    }
  } else {
    return content;
  }
}

/**
 * Counts the number of words in an html string
 * @param {string} html Expected to be the rendered html string from a markdown file
 * @return {number} Number of whole words in the html string
 */
function get_word_count(html) {
  let words = html.replace(/<[^>]*>/g," ");
  words = words.replace(/\s+/g, ' ');
  words = words.trim();

  return words.split(" ").length
}

/**
 * Returns the number of minutes an average reader would need to read a given number of words
 * @param {number} word_count The number of words to read
 * @return {number} The number of minutes it would take an average reader to read
 */
function get_reading_time(word_count) {
  const orientation_seconds = 4
  const words_per_minute = 275;
  const readable_content = 1;

  const reading_time_in_minutes = Math.round(word_count / words_per_minute) * readable_content

  return reading_time_in_minutes
}

/**
 * Convert a single markdown file into a file object for consumption in Vue.js
 * @param {string} file_path Full path to the file from root of system
 * @return {object} Returns an object containing the file metadata and rendered html
 */
function render_file(file_path) {
  // Filter function to retrieve .md files
  if(path.extname(file_path) !== ".md") return null;

  // If markdown file, read contents //
  const data = fs.readFileSync(file_path, "utf8");
  // Convert to frontmatter object and markdown content //
  let fileInfo = matter(data);
  fileInfo = Object.assign({}, fileInfo.data, fileInfo);

  let stats = fs.statSync(file_path)

  fileInfo.updated = fileInfo.updated
    ? new Date(fileInfo.updated).toISOString()
    : stats.mtime;
  fileInfo.created = fileInfo.created
    ? new Date(fileInfo.created).toISOString()
    : stats.birthtime;

  fileInfo.url =
    fileInfo.url ||
    file_path
      .replace(markdown_folder, "")
      .replace(path.extname(file_path), "");

  if (fileInfo.url === "/index") {
    fileInfo.url = "/";
  }

  fileInfo.html = md.render(fileInfo.content);
  fileInfo.wordCount = get_word_count(fileInfo.html);
  fileInfo.readingTime = get_reading_time(fileInfo.wordCount);

  fileInfo.excerpt = md
    .render(fileInfo.excerpt || excerpt(fileInfo.content))
    .replace(/(<([^>]+)>)/gi, "");

  fileInfo.description = fileInfo.description || fileInfo.excerpt
    .slice(0, 297) + "...";

  fileInfo.excerpt = fileInfo.excerpt || fileInfo.description

  fileInfo.path = file_path.replace(path.join(__dirname, '..'), '')

  delete fileInfo.orig;
  delete fileInfo.data;
  delete fileInfo.content;

  return fileInfo
}

/**
 * Decide what conditions are required for the file to be added to the rendered markdown files in production
 */
function add_file_to_array(fileInfo, file_path, files) {
  if(fileInfo) {
    let index = files.findIndex(file => file.url === fileInfo.url)

    if(index > -1) {
      files[index] = fileInfo
      console.log(colors.blue(`"${path.basename(file_path)}" updated.`))
    } else {
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
      console.log(colors.blue(`"${path.basename(file_path)}" added.`))
    }    
  }
  return files;
}

/**
 * Render all markdown files
 * Retrieves all markdown files, renders each one's html, and saves the output as an array of file objects containing the rendered html and file metadata
 * @return {Promise} Returns a list of file objects with rendered html
 */
exports.renderMarkdownFolder = function renderMarkdownFolder() {
  return new Promise(resolve => {
    let files = [];
    if (fs.existsSync(markdown_folder)) {
      klaw(markdown_folder)
        .on("data", item => {
          const fileInfo = render_file(item.path);
          files = add_file_to_array(fileInfo, item.path, files);
        })
        .on("error", console.log)
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

/**
 * Render one specific markdown file and upsert it to the array of markdown files
 * @param {string} file_path Full path to the file from root of system
 * @param {Object[]} files List of currently rendered file objects
 * @return {Promise} Returns a list of file objects with rendered html
 */
exports.renderMarkdownFile = function renderMarkdownFile(file_path, files = []) {
  return new Promise(resolve => {

    const fileInfo = render_file(file_path);

    files = add_file_to_array(fileInfo, file_path, files);

    files = files.sort(function(a, b) {
      return new Date(b.created) - new Date(a.created);
    });

    resolve([ files, fileInfo]);
  });
}
