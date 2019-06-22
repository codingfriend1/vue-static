const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const inject = require("gulp-inject");
const runSequence = require("run-sequence");
const _ = require("lodash");
const config = require("./site.config.js");
const del = require('del');

const folders = {
  components: path.resolve(__dirname, config.folderStructure.components),
  globalize_components_file: path.resolve(__dirname, "the-magic", "boot", "router.js"),
  output_folder: path.join(__dirname, config.folderStructure.output)
};

const globalize_components_folder = folders.globalize_components_file.replace(
  path.basename(folders.globalize_components_file),
  ""
);

gulp.task('delete-dist-folder', function(cb) {
  return del([folders.output_folder], cb);
});

gulp.task("globalize-vue-components", function() {
  return gulp
    .src(folders.globalize_components_file)
    .pipe(
      inject(
        gulp.src([
          folders.components + "/**/*.vue",
          "!" + folders.components + "/**/index.vue"
        ], {
          read: false
        }),
        {
          relative: false,
          starttag: "// globalize vue components",
          endtag: "// end globalize vue components",
          transform: function(filepath, file, i, length) {
            let title = filepath.replace(/^.*[\\\/]/, "");
            title = _.camelCase(title.substr(0, title.lastIndexOf(".")));
            let fp = filepath.replace("/", "");
            return `${title}: Vue.component('${title}', require("../../${fp}")),`;
          }
        }
      )
    )
    .pipe(gulp.dest(globalize_components_folder));
});

gulp.task("default", function(done) {
  runSequence("delete-dist-folder", "globalize-vue-components", done);
});
