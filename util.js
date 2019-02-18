#!/usr/bin/env node

const removeWhiteSpaces = array => {
  return array.filter(function(element) {
    return element !== '';
  });
};

const removeDuplicates = array => {
  return [...new Set(array)];
};

const removeFirst2Caracters = array => {
  return array.map(function(element) {
    return element.substring(2);
  });
};

const removeNotAllowed = (array, noPermitidos) => {
  return array.filter(function(element) {
    return !(element in noPermitidos);
  });
};

module.exports = {
  removeNotAllowed,
  removeWhiteSpaces,
  removeDuplicates,
  removeFirst2Caracters,
};
