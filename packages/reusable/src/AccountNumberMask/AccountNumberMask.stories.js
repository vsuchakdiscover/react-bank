import React from "react";
import { text } from "@storybook/addon-knobs";

import AccountNumberMask from "./AccountNumberMask";

export default { title: "AccountNumberMask" };

export const example = () => (
  <AccountNumberMask value={text("value", "123456789")}></AccountNumberMask>
);
