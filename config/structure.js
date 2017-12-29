// Folder Structure Defaults
const build = 'PUBLIC'
const css   = 'css'
const js    = 'js'
const img   = 'img'

// Where to look for source files
exports.src = {
  css:    `${css}/*.css`,
  js:     `${js}/*.js`,
  img:    `${img}/*.{jpeg, jpg, png, webp}`,
}

// Where to build your site
exports.dest = {
  dir:    `${build}`,
  css:    `${build}/${css}`,
  js:     `${build}/${js}`,
  img:    `${build}/${img}`,
}
