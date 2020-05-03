// Return unique array by propertyName. Via https://stackoverflow.com/a/46219650/26180
export const uniqueArrayByProperty = (array, propertyName) => {
  return array.filter(
    (e, i) => array.findIndex((a) => a[propertyName] === e[propertyName]) === i
  );
};
