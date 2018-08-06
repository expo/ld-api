let fetch = require("node-fetch");

let jams = [
  97793, // LD42
  73256, // LD41
  49883, // LD40
  32802, // LD39
  9405 // LD38
  // 10, // LD37 -- not really populated
];

async function getJamFeedAsync(jam) {
  let combinedFeed = [];
  let offset = 0;
  let limit = 50;
  while (true) {
    console.log(
      "Getting feed for " + jam + " offset=" + offset + " limit=" + limit
    );
    let feed = await _getPartialFeedOfGamesAsync(jam, offset, limit);
    console.log("done.");
    if (feed.length === 0) {
      return combinedFeed;
    } else {
      combinedFeed = [].concat(combinedFeed, feed);
      offset += limit;
    }
  }
}

async function _getPartialFeedOfGamesAsync(jam, offset, limit) {
  let url =
    "http://api.ldjam.com/vx/node/feed/" +
    jam +
    "/grade-01-result+reverse+parent/item/game/compo+jam?offset=" +
    offset +
    "&limit=" +
    limit;
  let response = await fetch(url, { method: "GET" });
  let result = await response.json();
  if (result.status && result.status == 200) {
    let feed = result.feed;
    return feed;
  } else {
    throw new Error("Bad response status " + result.status);
  }
}

async function getAllGamesAsync() {
  let all = [];
  for (let jam of jams) {
    let games = await getJamFeedAsync(jam);
    all = [].concat(all, games);
  }
  return all;
}

async function getAllGamesWithInfoAsync() {
  let allGames = await getAllGamesAsync();
  let gameIds = [];
  for (let game of allGames) {
    let id = game.id;
    gameIds.push(id);
  }
  let info = await multiGetGameInfoAsync(gameIds);
  return {
    games: allGames,
    info,
  };
}

async function getListOfGamesAsync(jam) {
  let offset = 10000;
  // Max is 50
  let response2 = await fetch(
    "http://api.ldjam.com/vx/node/feed/73256/grade-01-result+reverse+parent/item/game/compo+jam?offset=" +
      offset +
      "&limit=50",
    {
      credentials: "include",
      headers: {},
      referrer: "http://ldjam.com/events/ludum-dare/41/games/overall/all",
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors"
    }
  );

  let response = await fetch(
    "http://api.ldjam.com/vx/node/feed/73256/grade-01-result+reverse+parent/item/game/compo+jam?limit=240",
    {
      credentials: "include",
      headers: {},
      referrer: "http://ldjam.com/events/ludum-dare/41/games/overall/all",
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors"
    }
  );
  let result = await response2.json();
  return result;
}

async function multiGetGameInfoAsync(gameIds) {
  let max = 250;

  let results = {};
  let remain = gameIds.slice(0);
  while (true) {
    let slice = remain.slice(0, max);
    remain = remain.slice(max);
    console.log("Getting game info for slice " + JSON.stringify(slice));
    let byId = await _multiGetGameInfoAsync(slice);
    console.log("done.");
    Object.assign(results, byId);
    if (remain.length === 0) {
      break;
    }
  }
  return results;
}

async function _multiGetGameInfoAsync(gameIds) {
  // Max is 250
  // TODO: If > 250, the make multiple requests and reassemble

  let url = "http://api.ldjam.com/vx/node/get/" + gameIds.join("+");

  let response = await fetch(
    // "http://api.ldjam.com/vx/node/get/75767+79063+88111+73774+74104+84309+88687+81461+75714+81319+76532+78758",
    url,
    {
      credentials: "include",
      headers: {},
      // referrer: "http://ldjam.com/events/ludum-dare/41/games/overall/all",
      // referrerPolicy: "no-referrer-when-downgrade",
      // body: null,
      method: "GET"
      // mode: "cors"
    }
  );
  let result = await response.json();

  if (result.status && result.status == 200) {
    let byId = {};
    for (item of result.node) {
      byId[item.id] = item;
    }
    return byId;
  } else {
    throw new Error("Bad status code on response: " + result.status);
  }
}

module.exports = {
  getListOfGamesAsync,
  multiGetGameInfoAsync,
  getJamFeedAsync,
  getAllGamesAsync,
  getAllGamesWithInfoAsync,
};
