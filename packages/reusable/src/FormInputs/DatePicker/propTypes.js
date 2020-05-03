import {
  string,
  bool,
  func,
  elementType,
  number,
  shape,
  oneOfType,
  array,
} from "prop-types";

export const dayTypeType = shape({
  legendLabel: string,
  showInLegend: bool,
  legendWeight: number,
  className: oneOfType([array, string]),
  handler: func,
  Component: elementType,
});

export const dateStringType = (props, propName, componentName) => {
  const value = props[propName];
  if (value === undefined || value === "") {
    return;
  }
  if (!/^\d{1,4}-\d{2}-\d{2}$/.test(value)) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. Expects a day string in "YYYY-MM-DD" format. Provided value is "${value}"`
    );
  }
};

export const legendItemTypePropTypes = {
  /** A class name for legend item square icon. */
  className: string,

  /** A legend item text. */
  label: string,
};

export const legendItemType = shape(legendItemTypePropTypes);
