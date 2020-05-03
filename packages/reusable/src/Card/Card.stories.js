import React from "react";
import Card from "./Card";

export default { title: "Cards/Card" };

export const defaultExample = () => <Card>Example content.</Card>;

export const orange = () => <Card design="orange">Example content.</Card>;

export const asListItem = () => (
  <>
    <Card as="li" className="mb-20">
      Item one
    </Card>
    <Card as="li" className="mb-20">
      Item two
    </Card>
  </>
);
