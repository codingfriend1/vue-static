const gulp = require("gulp");
const path = require("path");
const inject = require("gulp-inject");
const camelCase = require("lodash.camelcase");
const config = require("../../site.config.js");
const folders = require('./folders.js')

const globalize_components_file = path.resolve(folders.boot, "router.js")

const globalize_components_folder = globalize_components_file.replace(
  path.basename(globalize_components_file), ""
);

gulp.task("default", function(done) {
  return gulp
    .src(globalize_components_file)
    .pipe(
      inject(
        gulp.src([
          folders.components_folder + "/**/*.vue",
          folders.partials_folder + "/**/*.vue",
          "!" + folders.components_folder + "/**/index.vue"
        ], {
          read: false
        }),
        {
          relative: false,
          starttag: "// globalize vue components",
          endtag: "// end globalize vue components",
          transform: function(filepath, file, i, length) {
            let title = filepath.replace(/^.*[\\\/]/, "");
            title = camelCase(title.substr(0, title.lastIndexOf(".")));
            let fp = filepath.replace("/", "");
            return `${title}: Vue.component('${title}', require("${fp}").default),`;
          }
        }
      )
    )
    .pipe(gulp.dest(globalize_components_folder));
});
