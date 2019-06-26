const path = require("path")
const config = require('../../site.config')

const root = path.resolve(__dirname, "..", "..")

const folders = {
  root,
  node_modules: path.resolve(root, "node_modules"),
  the_magic: path.resolve(root, 'the-magic'),
  boot: path.resolve(root, "the-magic", "boot"),
  src: path.resolve(root, "src"),
  entry_client: path.resolve(root, "the-magic", "boot", "index.js"),
  entry_server: path.resolve(root, "the-magic", "boot", "entry-server.js"),
  markdown_folder: path.resolve(root, config.folderStructure.markdown),
  template_html_path: path.resolve(root, config.folderStructure.html),
  css_path: path.resolve(root, config.folderStructure.css),
  vue_path: path.resolve(root, config.folderStructure.vue),
  js_path: path.resolve(root, config.folderStructure.js),
  config_path: path.resolve(root, 'site.config.js'),
  components_folder: path.resolve(root, config.folderStructure.components),
  partials_folder: path.resolve(root, config.folderStructure.partials),
  static_folder: path.resolve(root, config.folderStructure.static),
  images_folder: path.resolve(root, config.folderStructure.images),
  html_template: path.resolve(root, config.folderStructure.html),
  output_folder: path.resolve(root, config.folderStructure.output),
};

module.exports = folders