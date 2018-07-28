const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const inject = require("gulp-inject");
const runSequence = require("run-sequence");
const _ = require("lodash");
const config = require("./site.config.js");
const del = require('del');

const folders = {
  theme: path.resolve(__dirname, "theme"),
  globalize_components_file: path.resolve(
    __dirname,
    "theme",
    config.relativePathInThemeToRoutes
  ),
  output_folder: path.join(__dirname, "dist")
};

const globalize_components_folder = folders.globalize_components_file.replace(
  path.basename(folders.globalize_components_file),
  ""
);

gulp.task('delete-dist-folder', function(cb) {
  return del([folders.output_folder], cb);
});

function generateInject(
  injectTo,
  outputFolder,
  arrayOfFilesToInject,
  startTag,
  importStatement,
  extractFileName
) {
  return gulp
    .src(injectTo)
    .pipe(
      inject(
        gulp.src(arrayOfFilesToInject, {
          read: false
        }),
        {
          relative: false,
          starttag: "// " + startTag,
          endtag: "// end " + startTag,
          transform: function(filepath, file, i, length) {
            if (extractFileName) {
              var title = filepath.replace(/^.*[\\\/]/, "");

              title = _.camelCase(title.substr(0, title.lastIndexOf(".")));

              if (importStatement === "vueGlobal") {
                var path;
                if (filepath.indexOf("..") !== -1) {
                  path = 'require("' + filepath + '")';
                } else {
                  path = 'require("./' + filepath + '")';
                }
                return `Vue.component('${title}', ${path})`;
              } else if (importStatement === "const") {
                return filepath.indexOf("..") !== -1
                  ? `const ${title} = require("${filepath}")`
                  : `const ${title} = require("./${filepath}")`;
              } else if (importStatement !== "require") {
                if (filepath.indexOf("..") !== -1) {
                  return importStatement + '("' + filepath + '")';
                } else {
                  return importStatement + '("./' + filepath + '")';
                }
              } else {
                let fp = filepath.replace("/", "");

                return `${title}: Vue.component('${title}', require("${fp}")),`;
              }
            } else {
              if (extractFileName) {
                var title = filepath.replace(/^.*[\\\/]/, "");
                title = title
                  .substr(0, title.lastIndexOf("."))
                  .replace("-", "_");
                if (importStatement !== "require") {
                  if (filepath.indexOf("..") !== -1) {
                    return "var " + title + ' = require("' + filepath + '")';
                  } else {
                    return "var " + title + ' = require("./' + filepath + '")';
                  }
                } else {
                  if (filepath.indexOf("..") !== -1) {
                    return title + ': require("' + filepath + '"),';
                  } else {
                    return title + ': require("./' + filepath + '"),';
                  }
                }
              } else {
                if (filepath.indexOf("..") !== -1) {
                  if (importStatement) {
                    return importStatement + '("' + filepath + '")';
                  }
                  return 'require("' + filepath + '")';
                } else {
                  if (importStatement) {
                    return importStatement + '("./' + filepath + '")';
                  }
                  return 'require("./' + filepath + '")';
                }
              }

              if (filepath.indexOf("..") !== -1) {
                return 'require("' + filepath + '")';
              } else {
                return 'require("./' + filepath + '")';
              }
            }
          }
        }
      )
    )
    .pipe(gulp.dest(outputFolder));
}

gulp.task("globalize-vue-components", function() {
  return generateInject(
    folders.globalize_components_file,
    globalize_components_folder,
    [
      folders.theme + "/**/*.vue",
      "!" + folders.theme + "/**/root.vue"
    ],
    "globalize vue components",
    "require",
    true
  );
});

gulp.task("default", function(done) {
  runSequence("delete-dist-folder", "globalize-vue-components", done);
});
