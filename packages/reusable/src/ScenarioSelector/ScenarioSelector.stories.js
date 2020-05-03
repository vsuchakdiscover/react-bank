import React, { useState } from "react";
import ScenarioSelector from "./ScenarioSelector";
import SelectInput from "../FormInputs/SelectInput";

export default {
  title: "ScenarioSelector",
  parameters: {
    info: {
      propTables: [ScenarioSelector],
    },
  },
};

function Example() {
  const [value, setValue] = useState("1");
  return (
    <ScenarioSelector>
      <SelectInput
        id="scenario"
        label="Scenario"
        name="scenario"
        onChange={() => {}}
        onValidate={() => {}}
        options={[
          { label: "Scenario 1", value: "1" },
          { label: "Scenario 2", value: "2" },
        ]}
        required
        setValue={setValue}
        value={value}
      />
    </ScenarioSelector>
  );
}

export const defaultExample = () => <Example />;
