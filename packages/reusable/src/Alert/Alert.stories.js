import React, { useRef, useEffect } from "react";
import Alert from "./Alert";
import { text, boolean } from "@storybook/addon-knobs";

function FocusExample() {
  const alertRef = useRef(null);

  useEffect(() => {
    if (alertRef) alertRef.current.focus();
  }, []);

  return (
    <Alert
      closable={boolean("closable", true)}
      ref={alertRef}
      type={text("type", "success")}
    >
      <p className="meta-web-bold">{text("children", "I receive focus!")}</p>
    </Alert>
  );
}

// Using the component story format - https://storybook.js.org/docs/formats/component-story-format/
export default {
  title: "Alert",
};

export const success = () => (
  <Alert closable={boolean("closable", true)} type={text("type", "success")}>
    <p className="meta-web-bold">{text("children", "Good News")}</p>
  </Alert>
);

export const error = () => (
  <Alert closable={boolean("closable", true)} type={text("type", "error")}>
    <p className="meta-web-bold">{text("children", "Bad News")}</p>
  </Alert>
);

export const warning = () => (
  <Alert closable={boolean("closable", true)} type={text("type", "warning")}>
    <p className="meta-web-bold">{text("children", "Warning")}</p>
  </Alert>
);

export const neutral = () => (
  <Alert closable={boolean("closable", true)} type={text("type", "neutral")}>
    <p className="meta-web-bold">{text("children", "Just News")}</p>
  </Alert>
);

export const withFunctionAsChildren = () => (
  <Alert closable={boolean("closable", true)} type={text("type", "success")}>
    {() => (
      <>
        <b className="meta-web-bold">{text("children", "Just News")}</b>
        <p>description text</p>
      </>
    )}
  </Alert>
);

export const focusExample = () => <FocusExample />;
