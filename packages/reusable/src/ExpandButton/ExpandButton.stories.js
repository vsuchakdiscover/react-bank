import React from "react";
import ExpandButton from "./ExpandButton";

function Example() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <ExpandButton
        isOpen={isOpen}
        label="Address"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && <p>Address info here</p>}
    </>
  );
}

export default {
  title: "Buttons/ExpandButton",
  parameters: {
    info: {
      propTables: [ExpandButton],
    },
  },
};

export const defaultExample = () => <Example />;
