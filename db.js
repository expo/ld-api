// const { Pool, Client } = require('pg')
let pg = require("pg");
let ghostSecret = require("../ghost-secret");

let pool = new pg.Client({
  user: ghostSecret.postgres.user,
  host: ghostSecret.postgres.host,
  database: ghostSecret.postgres.instance,
  password: ghostSecret.postgres.password,
  port: ghostSecret.postgres.port
});
pool.connect();

function queryAsync(q) {
  return new Promise((resolve, reject) => {
    pool.query(q, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
    // pool.end();
  });
}

module.exports = {
  queryAsync,
  pool,
  pg,
  ghostSecret
};
