import React from "react";
import FormSectionContext from "./FormSectionContext";
import { PropTypes } from "prop-types";

// This optional component wraps a form section. This uses context to provide the section name to
// each input. Without this, you have to pass the section prop to each input.
// Optionally accepts an onChange so you can call a custom onChange for a section's inputs.
const FormSection = ({ section, sectionNumber, onChange, children }) => {
  return (
    <FormSectionContext.Provider
      value={{
        section,
        onChange,
        sectionNumber,
      }}
    >
      {children}
    </FormSectionContext.Provider>
  );
};

FormSection.propTypes = {
  /** Child components */
  children: PropTypes.node.isRequired,

  /** onChange function to run for each input in the section */
  onChange: PropTypes.func,

  /** Section name (used for error summary) */
  section: PropTypes.string.isRequired,

  // TODO: Rename to title and number
  /** The section number - Optional. Useful when there are multiple instances of the section. Used to create a unique ID for each input in each section.  */
  sectionNumber: PropTypes.number,
};

FormSection.defaultProps = {
  sectionNumber: 1,
};

export default FormSection;
