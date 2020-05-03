import React from "react";
import Button from "./Button";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const tree = renderer.create(<Button>Example text</Button>).toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders as disabled when disabled prop is specified", () => {
  const tree = renderer.create(<Button disabled>Example text</Button>).toJSON();
  expect(tree).toMatchSnapshot();
});
