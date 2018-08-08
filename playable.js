let flat = require('./flat');

let html5tag = '42336';

let yes = 0;
let no = 0;
let total = 0;
let itch = 0;

let links = [];

for (let g of flat) {
  let y = false;
  for (let mk in g.meta) {
    let m = g.meta[mk];
    if (m === html5tag) {
      y = true;
      let tk = mk.replace(/-tag$/, '');
      let link = g.meta[tk];
      if (!link) {
          continue;
      }
      if (link && link.match(/itch\.io\//)) {
          console.log(link, g.id);
          itch++;
      }
    //   console.log(tk);
      links.push({
          id: g.id,
          name: g.name,
          link: g.meta[tk],
      });
    }
  }
  if (y) {
    yes++;
  } else {
    no++;
  }
  total++;
}

console.log({
  yes,
  no,
  itch,
  total,
});
// console.log(links);
