import React from "react";
import DefinitionList from "./DefinitionList";
import EBillIcon from "../Icons/EBillIcon";

export default { title: "DefinitionList " };

export const defaultExample = () => (
  <DefinitionList
    items={[
      { label: "Pay From", value: "Cashback Debit (1234)" },
      { divClass: "specialStyles", label: "Amount", value: "$100" },
      { label: "Frequency", value: "Monthly" },
      {
        label: "Delivery Method",
        value: (
          <>
            <EBillIcon /> Electronic
          </>
        ),
      },
    ]}
  />
);
