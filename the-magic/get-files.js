const fs = require("fs");
const klaw = require("klaw");
const path = require("path");
const matter = require("gray-matter");
const showdown = require("showdown");
const converter = new showdown.Converter();

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

            fileInfo.updated = fileInfo.updated ? new Date(fileInfo.updated).toISOString() : item.stats.mtime;
            fileInfo.created = fileInfo.created ? new Date(fileInfo.created).toISOString() : item.stats.birthtime;
            fileInfo.url =
              fileInfo.url ||
              item.path
                .replace(markdown_folder, "")
                .replace(path.extname(item.path), "");

            if (fileInfo.url === "/index") {
              fileInfo.url = "/";
            }

            fileInfo.html = converter.makeHtml(fileInfo.content);
            fileInfo.excerpt = converter.makeHtml(fileInfo.excerpt || excerpt(fileInfo.content)).replace(/(<([^>]+)>)/ig,"");
            
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
