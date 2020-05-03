import React from "react";
import { storiesOf } from "@storybook/react";
import EditProfile from "./EditProfile";

storiesOf("EditProfile", module).add("default", () => (
  <EditProfile onClickCancel={() => {}} onSubmit={() => {}} />
));
