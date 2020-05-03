import React from "react";
import SpinnerWrapper from "./SpinnerWrapper";
import Button from "../Button";
import { text, boolean } from "@storybook/addon-knobs";

export default { title: "Spinner Wrapper" };
export const defaultExample = () => (
  <SpinnerWrapper
    isLoading={boolean("isLoading", true)}
    loadingText={text("loadingText", "Adding your Discover Credit Cards...")}
  >
    <form>
      <div className="row">
        <p className="col overlayHeader">
          Add your Discover credit card to your payees.
        </p>
      </div>
      <p>
        It&apos;s the easy way to pay your Discover credit card bill, review
        payments, and more.
      </p>

      <Button type="submit">Add Now</Button>
    </form>
  </SpinnerWrapper>
);

export const noLoadingText = () => (
  <SpinnerWrapper isLoading={boolean("isLoading", true)}>
    <form>
      <div className="row">
        <p className="col overlayHeader">
          Add your Discover credit card to your payees.
        </p>
      </div>
      <p>
        It&apos;s the easy way to pay your Discover credit card bill, review
        payments, and more.
      </p>

      <Button type="submit">Add Now</Button>
    </form>
  </SpinnerWrapper>
);
