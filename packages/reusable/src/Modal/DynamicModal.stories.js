import React from "react";
import DynamicModals from "./DynamicModals";

export default { title: "Modals/DynamicModal" };

export const dynamicModal = () => <DynamicModals />;
dynamicModal.story = {
  parameters: {
    notes:
      "See the DynamicModals.js file for sample implemenation. Consider an implementation like this if mutliple links reference the same overlay or there are several modal overlays on the page. This example also shows a way to pass dyamic content to the overlay copy. Options, options, options.",
  },
};
