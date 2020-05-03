import { getNextDateFromKeyCode } from "./utils";

import { KEY } from "./data";

describe("getNextDateFromKeyCode", () => {
  it.each`
    keyCode      | date                      | nextDate
    ${KEY.RIGHT} | ${new Date(2019, 3, 20)}  | ${new Date(2019, 3, 21)}
    ${KEY.RIGHT} | ${new Date(2019, 3, 30)}  | ${new Date(2019, 4, 1)}
    ${KEY.RIGHT} | ${new Date(2019, 11, 31)} | ${new Date(2020, 0, 1)}
    ${KEY.RIGHT} | ${new Date(2020, 1, 28)}  | ${new Date(2020, 1, 29)}
    ${KEY.RIGHT} | ${new Date(2020, 1, 29)}  | ${new Date(2020, 2, 1)}
    ${KEY.LEFT}  | ${new Date(2019, 3, 20)}  | ${new Date(2019, 3, 19)}
    ${KEY.LEFT}  | ${new Date(2019, 3, 1)}   | ${new Date(2019, 2, 31)}
    ${KEY.LEFT}  | ${new Date(2020, 0, 1)}   | ${new Date(2019, 11, 31)}
    ${KEY.LEFT}  | ${new Date(2020, 1, 29)}  | ${new Date(2020, 1, 28)}
    ${KEY.LEFT}  | ${new Date(2020, 2, 1)}   | ${new Date(2020, 1, 29)}
    ${KEY.UP}    | ${new Date(2019, 3, 20)}  | ${new Date(2019, 3, 13)}
    ${KEY.UP}    | ${new Date(2019, 3, 1)}   | ${new Date(2019, 2, 25)}
    ${KEY.UP}    | ${new Date(2020, 0, 1)}   | ${new Date(2019, 11, 25)}
    ${KEY.UP}    | ${new Date(2020, 1, 29)}  | ${new Date(2020, 1, 22)}
    ${KEY.UP}    | ${new Date(2020, 2, 1)}   | ${new Date(2020, 1, 23)}
    ${KEY.DOWN}  | ${new Date(2019, 3, 20)}  | ${new Date(2019, 3, 27)}
    ${KEY.DOWN}  | ${new Date(2019, 2, 25)}  | ${new Date(2019, 3, 1)}
    ${KEY.DOWN}  | ${new Date(2019, 11, 25)} | ${new Date(2020, 0, 1)}
    ${KEY.DOWN}  | ${new Date(2020, 1, 22)}  | ${new Date(2020, 1, 29)}
    ${KEY.DOWN}  | ${new Date(2020, 1, 23)}  | ${new Date(2020, 2, 1)}
  `(
    "should go to $nextDate when pressing key '$keyCode' on $date",
    ({ keyCode, date, nextDate }) => {
      expect(getNextDateFromKeyCode(date, keyCode)).toStrictEqual(nextDate);
    }
  );
});
