import {nanoid} from 'nanoid';
import {capitalizeFirstLetter, roundUpToNearest} from "../util.js";

/**
 * A single member to be used when splitting expenses
 * @typedef {Object} Member
 * @property {string} mem_id
 * @property {string} mem_name
 */

/**
 * A single expenses to be used when splitting expenses
 * @typedef {Object} Expense
 * @property {string} exp_id
 * @property {string} exp_name
 * @property {number} exp_amount
 */

export const splitEvenly = {
  /**
   * An array of objects containing member id's and name
   * @type {Array<Member>}
   */
  members: [],

  /**
   * An array of objects containing expense id's, title, and amount
   * @type {Array<Expense>}
   */
  expenses: [],

  divvyName: `dv_split_${nanoid(8)}`,
  isAlertVisible: false,
  alertText: "",
  alertTimeoutId: null,
  alertEl: document.getElementById('split_alert'),
  isResultValid: function() {
    return this.members.length >= 2 && this.expenses.length >= 1;
  },

  /**
   * Creates a new member object and appends it to the members state array
   * @param {HTMLInputElement} inputEl
   * @return null
   */
  addNewMember(inputEl) {
    // Validate name to make sure it doesn't start with empty spaces
    if (inputEl.value.trim() === '') {
      this.showAlert("Enter a valid name", true)
      inputEl.value = '';
      inputEl.focus()
      inputEl.parentElement.classList.add('input-error')
      return null;
    }

    /** @type {Member} */
    const newMember = {
      mem_id: nanoid(7),
      mem_name: capitalizeFirstLetter(inputEl.value.trim())
    };

    this.members.push(newMember);
    this.showAlert(`Added ${newMember.mem_name} to members!`, false)
    inputEl.value = '';
    inputEl.focus();
    inputEl.parentElement.classList.remove('input-error');

  },

  /**
   * Creates a new expenses object and appends it to the expenses state array
   * @param {HTMLInputElement} inputNameEl
   * @param {HTMLInputElement} inputAmountEl
   * @return null
   */
  addNewExpense(inputNameEl, inputAmountEl) {
    // Validate name to make sure it doesn't start with empty spaces
    if (inputNameEl.value.trim() === '' || inputAmountEl.value.trim() === '') {
      this.showAlert("Enter a valid name and amount", true)
      inputNameEl.value= '';
      inputNameEl.focus();
      inputNameEl.parentElement.classList.add('input-error');
      return null;
    }

    // Validate amount to make sure it's a numerical value
    if (isNaN(parseFloat(inputAmountEl.value.trim()))) {
      this.showAlert("Amount must a numeric value", true)
      inputAmountEl.value = '';
      inputAmountEl.focus();
      inputAmountEl.parentElement.classList.add('input-error');
      return null;
    }

    /** @type {Expense} */
    const newExpense = {
      exp_id: nanoid(7),
      exp_name: capitalizeFirstLetter(inputNameEl.value.trim()),
      exp_amount: parseFloat(inputAmountEl.value.trim())
    };

    this.expenses.push(newExpense);
    this.showAlert(`Expense ${newExpense.exp_name} to expenses!`, false)
    inputNameEl.value = '';
    inputAmountEl.value = '';
    inputNameEl.parentElement.classList.remove('input-error');
    inputAmountEl.parentElement.classList.remove('input-error');
    inputNameEl.focus();

  },

  /**
   * Removes a member from the state members array using the member id value
   * @param {String} id
   * @return null
   */
  removeMember(id) {
    this.members = this.members.filter(member => member.mem_id !== id);
  },

  /**
   * Removes an expense from the state expenses array using the expense id value
   * @param {String} id
   * @return null
   */
  removeExpense(id) {
    this.expenses = this.expenses.filter(expense => expense.exp_id !== id);
  },

  /**
   * Reset state members array back to default
   * @return null
   */
  resetMembers() {
    this.members = [];
  },

  /**
   * Reset state expenses array back to default
   * @return null
   */
  resetExpenses() {
    this.expenses = [];
  },

  /**
   * Reset state back to defaults
   * @return null
   */
  resetAll() {
    this.members = [];
    this.expenses = [];
    this.isAlertVisible = false;
    this.alertText = "";
    this.divvyName = `dv_split_${nanoid(8)}`;
  },

  /**
   * Calculate the total expenses
   * @return {number}
   */
  calcExpTotal() {
    let total = 0;
    this.expenses.forEach(expense => {
      total += expense.exp_amount;
    });
    return roundUpToNearest(total);
  },

  /**
   * Calculate the total expenses split between each member
   * @return {number}
   */
  calcSplitTotal() {
    let splitTotal = this.calcExpTotal() / this.members.length;
    return roundUpToNearest(splitTotal);
  },

  /**
   * Triggers the alert element to show and hides it after 3 seconds
   * @param {String} message
   * @param {boolean} isError
   * @return null
   */
  showAlert(message, isError) {
    if(this.alertTimeoutId) clearTimeout(this.alertTimeoutId);

    if(isError) {
      this.alertEl.classList.remove('bg-success')
      this.alertEl.classList.add('bg-error');
    } else {
      this.alertEl.classList.add('bg-success')
      this.alertEl.classList.remove('bg-error');
    }

    this.isAlertVisible = true;
    this.alertText = message;
    this.alertTimeoutId = setTimeout(() => {
      this.isAlertVisible = false;
      this.alertText = "";
    }, 4500);
  },
}