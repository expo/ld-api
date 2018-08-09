let ldgames = require("./ldgames");

let flat = Object.values(ldgames.info);

let yes = 0;
let no = 0;

for (let game of flat) {
  let meta = game.meta;
  let aYes = false;
  // console.log(meta);
  for (m of Object.values(meta)) {
    if (m === "42336") {
      aYes = true;
      yes++;
      continue;
    }
  }
  if (!aYes) {
    no++;
  }
}

console.log("yes=", yes, "no=", no);
