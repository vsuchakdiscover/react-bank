/**
 * Allows to mark a propType as isRequired if it fulfills a condition.
 *
 * Usage example:
 *  propIs({
 *      ofType: PropTypes.string,
 *      requiredIf: props => !props.height
 *  })
 *
 * @param ofType
 * @param requiredIf
 * @returns {Function}
 */
export default function ({ ofType, requiredIf }) {
  return function (props, propName, componentName) {
    if (!isFunction(ofType)) {
      return createError("ofType", componentName);
    }

    if (requiredIf && !isFunction(requiredIf)) {
      return createError("requiredIf", componentName);
    }

    const componentInstance = this;
    const propTypeCheck =
      requiredIf && requiredIf(props) ? ofType.isRequired : ofType;
    return propTypeCheck.call(componentInstance, ...arguments);
  };
}

const isFunction = (x) => typeof x === "function";

const createError = (argName, componentName) =>
  new Error(
    `Invalid propIs parameter ${argName} supplied to "${componentName}". Make sure it's a function. Validation failed.`
  );
