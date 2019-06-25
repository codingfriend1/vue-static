/**
 * Gathers fullsized images in the designated images folder and reduces their filesize for use on the web and saves them ot the designated static folder using the same structure they had in the images folder
 */

const path = require('path')
const imagemin = require("imagemin-keep-folder")
const imageminJpegRecompress = require('imagemin-jpeg-recompress')
const webp = require("imagemin-webp")
const imageminOptipng = require('imagemin-optipng')
const config = require('../../site.config.js')

const inputFolder = path.resolve(__dirname, "..", "..", config.folderStructure.images)
const outputFolder = path.resolve(__dirname, "..", "..", config.folderStructure.static)

const PNG = path.join(inputFolder, `**`, `/*.png`)
const JPG = path.join(inputFolder, `**`, `*.jpg`)
const JPEG = path.join(inputFolder, `**`, `*.jpeg`)

imagemin([PNG], {
  use: [
    webp({
      lossless: true
    })
  ],
  replaceOutputDir: output => {
    return path.join(outputFolder, path.basename(output))
  }
});

imagemin([PNG], {
  use: [
    imageminOptipng({
      optimizationLevel: 3
    })
  ],
  replaceOutputDir: output => {
    return path.join(outputFolder, path.basename(output))
  }
});

imagemin([JPG, JPEG], {
  use: [
    webp({
      quality: 80 // Quality setting from 0 to 100
    })
  ],
  replaceOutputDir: output => {
    return path.join(outputFolder, path.basename(output))
  }
});

imagemin([JPG, JPEG], {
  use: [
    imageminJpegRecompress({
      accurate: true,
      quality: 'high',
      min: 50,
      max: 90,
      loops: 6,
      progressive: true,
      strip: true,
      target: 0.9
    })
  ],
  replaceOutputDir: output => {
    return path.join(outputFolder, path.basename(output))
  }
});