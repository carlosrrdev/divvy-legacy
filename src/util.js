import {compareAsc} from 'date-fns'

/**
 * @type {import("../types.js").Divvy} Divvy
 */

/**
 * Capitalizes the first letter of a given string.
 *
 * @param {string} str - The input string.
 * @return {string} - The input string with the first letter capitalized.
 */
export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Rounds up a number to the nearest hundredth.
 *
 * @param {number} num - The number to round up.
 * @return {number} The rounded-up number.
 */
export function roundUpToNearest(num) {
  return Math.ceil(num * 100) / 100;
}

/**
 * Sorts the data by dates, newest first
 * @param {Array<import("/types.js").StoredDivvy>} data
 * @return {Array<import("/types.js").StoredDivvy>}
 */
export function sortDatesByNewestFirst(data) {
  // go through each object in the data array and compare createdAt dates, push into sortedArray based on newest first
  return data.sort((a, b) => compareAsc(a.createdAt, b.createdAt));
}

/**
 * Compares two arrays and checks if they are equal.
 *
 * @param {Array<Divvy>} arr1 - The first array to compare.
 * @param {Array<Divvy>} arr2 - The second array to compare.
 * @return {boolean} - Returns true if the arrays are equal, false otherwise.
 */
export function compareArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    console.log(`Arr1: ${arr1[i].id}, Arr2: ${arr2[i].id}`);
    if (arr1[i].id !== arr2[i].id) return false;
  }
  return true;
}