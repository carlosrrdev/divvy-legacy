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
 * Sorts the given array of Divvies by createdAt date
 * @param {Array<Divvy>} divvies
 * @param {("desc"|"asc")} order
 * @return {Array<Divvy>}
 */
export function sortDivviesByDate(divvies, order = 'desc') {
  return divvies.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (order === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
}