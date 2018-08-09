const imagemin = require("imagemin-keep-folder")
const imageminJpegRecompress = require('imagemin-jpeg-recompress')
const webp = require("imagemin-webp")

const outputFolder = "./static/"
const PNG = "./unoptimized-images/**/*.png"
const JPEG = "./unoptimized-images/**/*.jpg"

imagemin([PNG], {
  use: [
    webp({
      lossless: true
    })
  ],
  replaceOutputDir: output => {
    return output.replace(/unoptimized-images\//, 'static/')
  }
});

imagemin([JPEG], {
  use: [
    webp({
      quality: 80 // Quality setting from 0 to 100
    })
  ],
  replaceOutputDir: output => {
    return output.replace(/unoptimized-images\//, 'static/')
  }
});

imagemin([JPEG], {
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
    return output.replace(/unoptimized-images\//, 'static/')
  }
});