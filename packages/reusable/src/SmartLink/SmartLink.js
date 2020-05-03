import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

/** Smart alternative to React Router's Link component. Handles external links and optionally tracks clicks.
 *  React Router's Link doesn't support external links: https://github.com/ReactTraining/react-router/issues/1147
 *  Uses Link for internal links and plain anchor for external links and any links with target="_blank". */
const SmartLink = ({ to, className, children, target, adobeEvent }) => {
  const isLocalLink =
    (typeof to === "string" && to.startsWith("/")) || typeof to === "object";

  if (isLocalLink && target && typeof to === "object")
    throw new Error(
      "You may not pass an object for `to` when the target is `_blank`. Why? Because this component uses a plain anchor when the target is _blank. Router's Link component doesn't support a target of _blank."
    );

  const props = { className };
  if (adobeEvent) props["data-track"] = adobeEvent;

  return isLocalLink && !target ? (
    <Link to={to} {...props}>
      {children}
    </Link>
  ) : (
    <a target={target} href={to} {...props}>
      {children}
    </a>
  );
};

SmartLink.propTypes = {
  /** Event code sent to Adobe for tracking purposes on click */
  adobeEvent: PropTypes.string,

  /** Link text */
  children: PropTypes.any.isRequired,

  /** CSS classname applied to link */
  className: PropTypes.string,

  /** Set to _blank to load the `to` URL in a new window. */
  target: PropTypes.oneOf(["_blank"]),

  /** Link URL */
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default SmartLink;
