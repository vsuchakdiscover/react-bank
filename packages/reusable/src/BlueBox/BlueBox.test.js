import React from "react";
import BlueBox from "./BlueBox";
import renderer from "react-test-renderer";

it("renders correctly", () => {
  const tree = renderer
    .create(
      <BlueBox header="Blue Box Header">So many things can go in here!</BlueBox>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
