let sqlite = require('sqlite');

let db$ = sqlite.open('./ldgames.sqlite3', { Promise });

module.exports = {
  db$,
}