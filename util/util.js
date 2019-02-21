#!/usr/bin/env node

const removeWhiteSpaces = array => array.filter(element => element !== '');

const removeDuplicates = array => [...new Set(array)];

const removeFirst2Caracters = array =>
  array.map(element => element.substring(2));

const removeNotAllowed = (array, noPermitidos) =>
  array.filter(element => !(element in noPermitidos));

module.exports = {
  removeNotAllowed,
  removeWhiteSpaces,
  removeDuplicates,
  removeFirst2Caracters,
};
//baksak