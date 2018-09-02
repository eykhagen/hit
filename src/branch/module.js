import { checkUndefined, writeError } from '../helper/cmd';

/**
 * Create a Branch
 * @param {string} name name of the branch
 */
export async function createBranch(name) {
  // http://www.nodegit.org/api/branch/#create
  if(checkUndefined(name)){
    writeError(`The branches's name must not be undefined`)
  }

}

/**
 * Checkout a branch
 * @param {*} reference Branch reference
 */
export async function checkoutBranch(reference) {
 // https://github.com/nodegit/nodegit/blob/master/examples/checkout-remote-branch.js
 console.log('checkout');
}