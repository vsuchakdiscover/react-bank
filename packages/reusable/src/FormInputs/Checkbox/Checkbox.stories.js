import React, { useState } from "react";

import Checkbox from "./Checkbox";
import Button from "../../Button";
import { text, boolean } from "@storybook/addon-knobs";
import Checkboxes from "./Checkboxes";

const SimpleCheckbox = () => {
  const [checked, setChecked] = useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  return (
    <Checkbox
      checked={checked}
      id="checkboxZ"
      name="checkboxZ"
      onChange={handleChange}
      value="checkboxZ"
    >
      {text(
        "text",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      )}
    </Checkbox>
  );
};

const CheckBoxWithError = () => {
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const ref = React.createRef();

  const handleChange = (event) => {
    setChecked(!checked);
    validate(event.target.checked);
  };

  const handleBlur = () => {
    validate(checked);
  };

  const validate = (_checked) => {
    setError(!_checked ? "Please accept the Terms & Conditions" : null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    validate(checked);
    if (!checked) ref.current.focus();
  };

  return (
    <form className="meta-web-normal" onSubmit={handleSubmit}>
      <p>
        To enroll in Bill Pay, just accept the Terms & Conditions and select
        “Enroll.”
      </p>
      <Checkbox
        aria-describedby="enrollBillPayError"
        checked={checked}
        error={error}
        id="enrollBillPay"
        name="enrollBillPay"
        onBlur={handleBlur}
        onChange={handleChange}
        ref={ref}
      >
        I accept Discover Bank Online Bill Pay Terms
      </Checkbox>
      <Button className="mt-30" type="submit">
        Enroll
      </Button>
    </form>
  );
};

function CheckboxExample() {
  const [checked, setChecked] = useState(false);
  // Set a ref so we can set focus on text input inside the checkbox
  const ref = React.createRef();

  return (
    <>
      <Checkbox
        checked={checked}
        id="checkboxA"
        name="checkboxA"
        onChange={() => setChecked(!checked)}
        ref={ref}
      >
        {text("text", "I love hamsters!")}
      </Checkbox>
      <br />
      <button onClick={() => ref.current.focus()}>
        Focus checkbox via ref
      </button>
    </>
  );
}

export default {
  title: "FormInputs/Checkbox",
  parameters: {
    info: {
      propTables: [Checkbox],
    },
  },
};

export const checkedStateControlledWithOnChange = () => <SimpleCheckbox />;

export const uncheckedStateControlledByKnob = () => (
  <Checkbox checked={boolean("checked", false)} id="checkboxA" name="checkboxA">
    {text("text", "I love hamsters!")}
  </Checkbox>
);

export const disabled = () => (
  <Checkbox checked={false} disabled={true} id="checkboxA" name="checkboxA">
    {text("text", "I love hamsters!")}
  </Checkbox>
);

export const disabledChecked = () => (
  <Checkbox checked={true} disabled={true} id="checkboxA" name="checkboxA">
    {text("text", "I love hamsters!")}
  </Checkbox>
);

export const setFocusViaRef = () => <CheckboxExample />;

export const validation = () => <CheckBoxWithError />;

export const multipleCheckboxes = () => {
  function MultipleCheckBoxesExample() {
    const [value, setValue] = useState(["completed"]);

    const options = [
      { label: "Processing", value: "processing" },
      {
        label: "Completed",
        value: "completed",
      },
      { label: "Cancelled", value: "cancelled" },
      { label: "Failed", value: "failed" },
      { label: "Other", value: "other" },
    ];

    function handleChange(e) {
      setValue(e.target.value);
    }

    return (
      <Checkboxes
        error={text("error", "An example error message.")}
        id="status"
        label="Status"
        name="status"
        onChange={handleChange}
        options={options}
        showSelectAll
        value={value}
      />
    );
  }

  return <MultipleCheckBoxesExample />;
};
