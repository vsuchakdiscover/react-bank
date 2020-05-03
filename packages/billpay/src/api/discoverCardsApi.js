import { get, post } from "./apiUtils";

export async function getDiscoverCards(params = {}) {
  return get("payee/v1/cards", { params });
}

export async function addDiscoverCards(cardsToAdd) {
  return post("payee/v1/cards/add", cardsToAdd);
}
