import React from "react";
import Tooltip from "./Tooltip";
import { number } from "@storybook/addon-knobs";

export default { title: "Tooltip" };
export const defaultExample = () => (
  <>
    <div>
      <Tooltip
        ariaLabel="I'm a tooltip"
        trigger={<p>Trigger Copy, Open Me!</p>}
        width={number("Tooltip Width (default is 300)", 300)}
      >
        <div className="meta-normal">
          <p>Tooltips rule!</p>
        </div>
      </Tooltip>
    </div>
    <div style={{ float: "right" }}>
      <Tooltip
        ariaLabel="I'm a tooltip"
        trigger={<p>I am on the right. You can change my width. Open Me!</p>}
        width={number("Tooltip Width (default is 300)", 300)}
      >
        <div className="meta-normal">
          <p>Tooltips rule!</p>
        </div>
      </Tooltip>
    </div>
  </>
);

/*export const withBoundariesDefined = () => (
  <div className="row justify-content-center">
    <div style={{ width: "300px" }}>
      <Tooltip
        ariaLabel="I'm a tooltip"
        boundaryWidth={number("Boundary Width", 300)}
        trigger={<p>Trigger Copy, I&apos;m in the middle!</p>}
        width={number("Tooltip Width (default is 300)", 300)}
      >
        <div className="meta-normal">
          <p>Another one!</p>
        </div>
      </Tooltip>
    </div>
  </div>
);*/
