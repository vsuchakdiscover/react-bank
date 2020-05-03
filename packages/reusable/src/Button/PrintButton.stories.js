import React, { useRef } from "react";
import PrintButton from "./PrintButton";

export default { title: "Buttons/PrintButton" };

function RefExample() {
  const ref = useRef();

  return (
    <>
      <p>
        If you only want to print part of the page, you can pass a ref to the
        content to print:
      </p>
      <p ref={ref}>
        When the print button is clicked, only this paragraph will be displayed
        in the print window since the ref is pointed to this paragraph. Note
        that ref is optional. Without a ref, you must call window.print
        yourself.
      </p>
      <PrintButton ref={ref} />
    </>
  );
}

export const defaultExample = () => <PrintButton />;

export const withOnClick = () => (
  <PrintButton fontSize={16} onClick={() => alert("clicked")} />
);

export const withRefToItemToPrint = () => <RefExample />;
