const imagemin = require("imagemin"),    // The imagemin module.
  webp = require("imagemin-webp"),   // imagemin's WebP plugin.
  outputFolder = "./static/uploads",            // Output folder
  PNGImages = "./unoptimized-images/*.png",         // PNG images
  JPEGImages = "./unoptimized-images/*.jpg";        // JPEG images

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