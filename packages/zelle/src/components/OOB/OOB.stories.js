import React from "react";
import { storiesOf } from "@storybook/react";
import OOB from "./OOB";

const channels = [
  {
    name: "mobile_phone",
    description: "xxx-xxx-1234",
    delivery_methods: [
      {
        name: "sms",
        description: "Text",
        active: false,
      },
      {
        name: "audio",
        description: "Voice",
        active: true,
      },
    ],
  },
  {
    name: "work_phone",
    description: "xxx-xxx-4567",
    delivery_methods: [
      {
        name: "audio",
        description: "Voice",
        active: false,
      },
    ],
  },
  {
    name: "email",
    description: "b***2@gmail.com",
    delivery_methods: [
      {
        name: "email",
        description: "Email",
        active: false,
      },
    ],
  },
];

storiesOf("OOB", module).add("default", () => <OOB channels={channels} />);
