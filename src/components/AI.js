import { getMoves } from "../util/GameUtil";

export default () => {
  self.addEventListener("getRandomMove", function (data) {
    console.log("message recieved");
    if (!data.squares || !data.localWinners || !data.lastMoveLocation) {
      postMessage("getRandomMove", null);
    } else {
      const move = getAIMove(data);
      postMessage("getRandomMove", move);
    }
  });

  self.addEventListener("fetch", (event) => {
    console.log("message recieved");
    event.respondWith(
      caches.match(event.request).then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
    );
  });
};

export function getAIMove(data) {
  let moves = getMoves(data);
  return random_item(moves);
}

function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}
