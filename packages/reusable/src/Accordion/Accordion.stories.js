/* eslint-disable react/prop-types */
import React from "react";
import Accordion from "./Accordion";
import Button from ".././Button";
import { text } from "@storybook/addon-knobs";

export default {
  title: "Accordion",
  parameters: {
    info: {
      propTables: [Accordion],
    },
  },
};

export const Example = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <>
      <Button
        aria-controls="accordionA"
        aria-expanded={isOpen ? "true" : "false"}
        onClick={toggle}
        onKeyPress={toggle}
      >
        {isOpen ? "Close" : "Open"}
      </Button>
      <Accordion
        duration={text("duration", 500)}
        id="accordionA"
        isOpen={isOpen}
      >
        <h1>Example content</h1>
        <p>
          Here&apos;s some content that can be hidden/shown via the Accordion.
        </p>
      </Accordion>
    </>
  );
};
