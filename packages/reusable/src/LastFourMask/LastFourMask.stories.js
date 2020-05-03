import React from "react";
import { text } from "@storybook/addon-knobs";

import LastFourMask from "./LastFourMask";

export default { title: "LastFourMask" };

export const example = () => (
  <div className="meta-web-normal">
    <LastFourMask value={text("value", "**89")}></LastFourMask>
  </div>
);

export const exampleWithLargeDots = () => (
  <div className="meta-web-normal">
    <LastFourMask largeFont value={text("value", "**89")}></LastFourMask>
  </div>
);

example.story = {
  parameters: {
    notes:
      "Account numbers are returned from the API service with asterisks + up to the last 4 visible characters. They always return 4 characters - ex: `**12` or `*123` or `1234` or `*******1234`",
  },
};
