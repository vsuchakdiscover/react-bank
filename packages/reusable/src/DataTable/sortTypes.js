const reSplitAlphaNumeric = /([0-9]+)/gm;

/**
 * A case-insensitive alphanumeric sort function. Used as a default sortType
 * for DataTable columns.
 *
 * It's a tweaked version of a default react-table alphanumeric sort type.
 * The default version was case-sesnsitive, the tweak below adds case-insensitivity
 * to the sort type.
 */
export const alphanumericCaseInsensitive = (rowA, rowB, columnID) => {
  let a = getRowValueByColumnID(rowA, columnID);
  let b = getRowValueByColumnID(rowB, columnID);

  // Force to strings (or "" for unsupported types) and make values lowercase
  // so sort could ignore cases.
  a = toString(a).toLowerCase();
  b = toString(b).toLowerCase();

  // Split on number groups, but keep the delimiter
  // Then remove falsey split values
  a = a.split(reSplitAlphaNumeric).filter(Boolean);
  b = b.split(reSplitAlphaNumeric).filter(Boolean);

  // While
  while (a.length && b.length) {
    let aa = a.shift();
    let bb = b.shift();

    const an = parseInt(aa, 10);
    const bn = parseInt(bb, 10);

    const combo = [an, bn].sort();

    // Both are string
    if (isNaN(combo[0])) {
      if (aa > bb) {
        return 1;
      }
      if (bb > aa) {
        return -1;
      }
      continue;
    }

    // One is a string, one is a number
    if (isNaN(combo[1])) {
      return isNaN(an) ? -1 : 1;
    }

    // Both are numbers
    if (an > bn) {
      return 1;
    }
    if (bn > an) {
      return -1;
    }
  }

  return a.length - b.length;
};

function getRowValueByColumnID(row, columnID) {
  return row.values[columnID];
}

function toString(a) {
  if (typeof a === "number") {
    if (isNaN(a) || a === Infinity || a === -Infinity) {
      return "";
    }
    return String(a);
  }
  if (typeof a === "string") {
    return a;
  }
  return "";
}
