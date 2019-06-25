const path = require("path")
const config = require('../site.config')

const root = path.resolve(__dirname, "..")

const folders = {
  node_modules: path.resolve(root, "node_modules"),
  the_magic: path.resolve(root, 'the-magic'),
  boot: path.resolve(root, "the-magic", "boot"),
  published_html_path: path.resolve(root, "the-magic", "boot", "_index.html"),
  css_folder: path.resolve(root, config.folderStructure.css),
  components_folder: path.resolve(root, config.folderStructure.components),
  partials_folder: path.resolve(root, config.folderStructure.partials),
  static_folder: path.resolve(root, config.folderStructure.static),
  html_template: path.resolve(root, config.folderStructure.html),
  output_folder: path.resolve(root, config.folderStructure.output),
};

module.exports = folders