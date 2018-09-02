import { Repository, Reference } from 'nodegit';
import chalk from 'chalk';
import { checkUndefined, writeError, writeSuccess, writeCommand} from '../helper/cmd';
import { openRepository } from '../helper/git';


/**
 * Create a Branch
 * @param {string} name name of the branch
 */
export async function createBranch(name: string) {
  // http://www.nodegit.org/api/branch/#create
  if(checkUndefined(name)){
    writeError(`The branches's name must not be undefined`)
    return null;
  } 
  writeCommand(`$ git branch ${name}`);

  // open the repository first (at cwd)
  const repo: Repository = await openRepository();
  if(typeof repo === 'undefined') {
    return null;
  }

  // get the head commit 
  const headCommit = await repo.getHeadCommit();

  // create the branch
  try {
    const ref = await repo.createBranch(name, headCommit, false);
    writeSuccess(`Successfully created branch ${chalk.underline(name)}`);
    return ref;
  } catch(e) {
    writeError(`Couldn't create new Branch`)
    writeError(e)
    return null;
  }
}

/**
 * Checkout a branch
 * @param {*} reference Branch reference
 */
export async function checkoutBranch(reference: Reference) {
 // https://github.com/nodegit/nodegit/blob/master/examples/checkout-remote-branch.js
 // console.log('checkout');
}