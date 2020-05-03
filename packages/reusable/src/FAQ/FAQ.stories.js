import React from "react";
import FAQ from "./FAQ";
import { faqs } from "./FaqList";

export default { title: "FAQ" };

export const defaultExample = () => (
  <FAQ
    answer={
      <p className="mb-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
    }
    index={1}
    key={1}
    question="Question text"
    tracking="TRACKED_VAR"
  />
);

export const faqList = () => (
  <>
    {faqs.map(({ q, a, t }, index) => (
      <FAQ answer={a} index={index} key={index} question={q} tracking={t} />
    ))}
  </>
);
faqList.story = { name: "FAQ List" };
