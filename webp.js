const imagemin = require("imagemin"), // The imagemin module.
  imageminJpegRecompress = require('imagemin-jpeg-recompress'),
  webp = require("imagemin-webp"), // imagemin's WebP plugin.
  outputFolder = "./static/uploads", // Output folder
  PNGImages = "./unoptimized-images/*.png", // PNG images
  JPEGImages = "./unoptimized-images/*.jpg"; // JPEG images

imagemin([PNGImages], outputFolder, {
  plugins: [webp({
      lossless: true // Losslessly encode images
  })]
});

imagemin([JPEGImages], outputFolder, {
  plugins: [webp({
    quality: 80 // Quality setting from 0 to 100
  })]
});

imagemin([JPEGImages], outputFolder, {
  plugins: [
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
  ]
})