import { addPayee } from "./payeesApi.mock";
import { uuid, post, get } from "./apiUtils.mock";

export async function getDiscoverCards(params = {}) {
  return get("cards", { params });
}

export async function addDiscoverCards(cardsToAdd) {
  const { data: cards } = await post("cards", cardsToAdd);

  const updatedCards = cards.map((c) => {
    return {
      //stub in the extra stuff after ...c, this is what the production api will do
      ...c,
      nickName: c.accountName,
      status: "ACTIVE",
      deliveryMethod: "STANDARD_ELECTRONIC",
      earliestPaymentDate: "2020-03-02",
      id: uuid(),
      leadDays: 2,
      cutOffTime: "13:00:00",
      reminderEligible: true,
      billerID: "300175",
      ebillStatus: "AVAILABLE",
      ebillCycle: "ONCE_A_MONTH",
      cardPaymentInfo: {
        dueDate: "2020-09-14",
        minimumBalance: 0.0,
        statementBalance: 0.0,
        currentBalance: 0.0,
      },
    };
  });

  //add to the mocks (payees and enrollment lists)
  await cards.forEach((c) => {
    c.nickName = c.accountName;
    c.cardPaymentInfo = {
      dueDate: "2020-09-14",
      minimumBalance: 0.0,
      statementBalance: 0.0,
      currentBalance: 0.0,
    };
    addPayee(c);
  });

  return { data: updatedCards };
}
