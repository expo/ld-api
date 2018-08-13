let fetch = require('node-fetch');

let flat = require('./flat');

let html5tag = '42336';

let yes = 0;
let no = 0;
let total = 0;
let itch = 0;

let links = [];

let itches = [];

async function mainAsync() {
  for (let g of flat) {
    try {
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
            // console.log(link, g.id);
            itch++;

            let itchUrl = g.meta[tk];
            // console.log('fetching ' + itchUrl);
            let response = await fetch(itchUrl);
            let body = await response.text();
            // console.log('done. body is ' + body.length + ' bytes');
            let x = body.match(/(\/\/v6p9d9t4.ssl.hwcdn.net\/[^"]+)/);

            if (!x || x.length < 1) {
              console.error('No embeddable HTML5 way to play this game');
              continue;
            }
            let itchEmbedUrl = x[0];

            let itchIdMatches = itchEmbedUrl.match(/\/v6p9d9t4\.ssl\.hwcdn\.net\/html\/([0-9]+)\//);
            let itchId;
            if (!itchIdMatches || itchIdMatches.length < 2) {
              itchId = null;
            } else {
              itchId = parseInt(itchIdMatches[1]);
            }

            let itchUsername = null;
            if (itchUrl) {
              let ium = itchUrl.match(/\/\/([^\.]+)\.itch\.io\//);
              if (ium && ium.length > 1) {
                itchUsername = ium[1];
              } else {
                console.error('No username for ' + itchUrl);
              }
            }

            itches.push({
              itchUrl,
              itchUsername,
              ldId: g.id,
              itchId: itchId,
              ld: g,
              instructionsMarkdown: g.body,
              author: g.author,
              name: g.name,
              itchPageContent: body,
              itchEmbedUrl: itchEmbedUrl,
            });
            console.error('Up to', itch, ' itches');
            // if (itch > 5) {
            //   console.log(JSON.stringify(itches));
            //   return;
            // }
          }
          //   console.log(tk);

          links.push({
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
    } catch (e) {
      console.error('Failed on ', g);
      console.error('because of', e);
    }
  }

  // console.log({
  //   yes,
  //   no,
  //   itch,
  //   total,
  // });

  // console.log(itches);
  console.log(JSON.stringify(itches));
}

if (module === require.main) {
  mainAsync();
}

module.exports = {
  mainAsync,
};

// console.log(links);
