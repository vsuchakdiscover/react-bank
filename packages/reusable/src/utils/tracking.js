// This file sends clicks and pageloads to Adobe for tracking purposes.

let s = window.s;

const clearVars = () => {
  return (
    (s.prop1 = ""),
    (s.prop5 = ""),
    (s.prop32 = ""),
    (s.eVar74 = ""),
    (s.prop10 = ""),
    (s.list1 = ""),
    (s.prop10 = ""),
    (s.events = ""),
    (s.prop19 = ""),
    (s.list2 = ""),
    (s.prop42 = ""),
    (s.products = "")
  );
};

function getViewPort() {
  const windowWidth = window.innerWidth;
  return windowWidth > 991
    ? "Wide"
    : windowWidth <= 991 && windowWidth > 767
    ? "Middle"
    : "Narrow";
}

// Track click.
// Accepts optional vars object to set one or more of the properties listed under clearVars above
export function clickTrack(fields, vars = {}) {
  clearVars();
  s.linkTrackVars = s.linkTrackVars + ",prop1,prop32";
  s.prop1 = fields;
  s.prop32 = "View Port:" + getViewPort();
  // Set `s` object properties for each property passed in on vars
  Object.keys(vars).forEach((key) => (s[key] = vars[key]));
  s.tl(this, "o", s.prop1);
}

// Track page load
// Accepts optional vars object to set one or more of the properties listed under clearVars above
export function pageTrack(pageSlug, vars = {}) {
  clearVars();
  s.pageName = pageSlug;
  s.prop32 = "View Port:" + getViewPort();
  // Set `s` object properties for each property passed in on vars
  Object.keys(vars).forEach((key) => (s[key] = vars[key]));
  // Always fire after any required click events to help simulate page load
  setTimeout(function () {
    s.t();
  }, 2000);
}
