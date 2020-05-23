import { getMoves } from "../util/GameUtil";

export function getAIMove(data) {
  let moves = getMoves(data);
  return random_item(moves);
}

function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}
