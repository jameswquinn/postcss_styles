// Folder Structure Defaults
const build  = 'PUBLIC'
const css    = 'css'

// Where to look for source files
exports.src = {
  css:    `${css}/*.css`
}

// Where to build your site
exports.dest = {
  dir:   `${build}`,
  css:   `${build}/${css}`
}
