import React from "react";
import { storiesOf } from "@storybook/react";
import ContactInfo from "./ContactInfo";

storiesOf("ContactInfo", module).add("With valid data", () => (
  <ContactInfo
    onEditInfoClick={() => {}}
    contactTypes={[
      { type: "Home Phone", value: "913-938-9239", isMobile: true },
      { type: "Work Phone", value: "331-242-1238", isMobile: false },
    ]}
  />
));
