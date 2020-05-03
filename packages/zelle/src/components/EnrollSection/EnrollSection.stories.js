import React from "react";
import { storiesOf } from "@storybook/react";
import EnrollSection from "./EnrollSection";

storiesOf("EnrollSection", module).add("Eligible, valid mobile", () => (
  <EnrollSection />
));
