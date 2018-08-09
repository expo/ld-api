let itches = require('./itches');
let itches2 = [];

for (let itch of itches) {
  x = Object.assign({}, itch);
  x.itchEmbedUrl = x.itchEmbedUrl.replace(/&quot;.*$/, '');
  if (x.ld.meta.cover) {
    x.coverImage = 'https://static.jam.vg' + x.ld.meta.cover.substr(2);
    console.error(x.coverImage);
  }
  itches2.push(x);
}

console.log(JSON.stringify(itches2));
