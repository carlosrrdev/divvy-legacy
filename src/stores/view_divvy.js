import {roundUpToNearest} from "../util.js";


/**
 * @type {import('/types.js').ViewDivvyStore} ViewDivvyStore
 */


/**
 * @type {ViewDivvyStore}
 */
export const viewDivvyStore = {
  isModalVisible: false,
  showConfirmDelete: false,
  loadedData: {},

  showDivvyModal(data) {
    this.isModalVisible = true;
    this.showConfirmDelete = false;
    this.loadedData = data;

    setTimeout(() => {
      document.getElementById('modal_view_divvy').showModal()
    }, 0)
  },

  calcExpTotal() {
    let total = 0;
    this.loadedData.expenses.forEach(expense => {
      total += expense.expAmount;
    });
    return roundUpToNearest(total);
  },

  calcSplitTotal() {
    let splitTotal = this.calcExpTotal() / this.loadedData.members.length;
    return roundUpToNearest(splitTotal);
  },

  async deleteDivvy(id) {
    try {
      await Alpine.store("dv_save").deleteSingleDivvy(id)
      this.hideDivvyModal()
      await Alpine.store("dv_save").getSavedData()
    } catch(error) {
      console.error(error)
    }
  },

  hideDivvyModal(){
    this.isModalVisible = false;
  }
}