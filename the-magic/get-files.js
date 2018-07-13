const fs = require("fs");
const klaw = require("klaw");
const path = require("path");
const matter = require("gray-matter");
const showdown = require("showdown");
const converter = new showdown.Converter();

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

            fileInfo.updated = fileInfo.updated || item.stats.mtime;
            fileInfo.created = fileInfo.created || item.stats.birthtime;
            fileInfo.url =
              fileInfo.url ||
              item.path
                .replace(markdown_folder, "")
                .replace(path.extname(item.path), "");

            if (fileInfo.url === "/index") {
              fileInfo.url = "/";
            }

            fileInfo.html = converter.makeHtml(fileInfo.content);
            fileInfo.excerpt = converter.makeHtml(fileInfo.excerpt);
            // fileInfo.slug =
            //   fileInfo.slug ||
            //   fileInfo.data.title
            //     .toLowerCase()
            //     .replace(/ /g, "-")
            //     .replace(/[^\w-]+/g, "");
            delete fileInfo.orig;
            delete fileInfo.data;

            if (!fileInfo.draft) {
              files.push(fileInfo);
            }
          }
        })
        .on("error", e => {
          console.log(e);
        })
        .on("end", () => {
          files = files.sort(function(a,b){
            return new Date(b.created) - new Date(a.created);
          });
          resolve(files);
        });
    } else {
      resolve(files);
    }
  });
};
