import { Repository, Reference, Branch } from 'nodegit';
import chalk from 'chalk';
import { checkUndefined, writeError, writeSuccess, writeCommand } from '../helper/cmd';
import { getShortNameFromRef } from '../helper/git';

/**
 * Create a Branch
 * @param {string} name name of the branch
 */
export async function createBranch(repo: Repository , name: string) {
  // http://www.nodegit.org/api/branch/#create
  if(checkUndefined(name)){
    writeError(`The branches's name must not be undefined`)
    return null;
  }
  writeCommand(`$ git branch ${name}`);

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
export async function checkoutBranch(repo: Repository, ref: Reference) {
  const shortName = getShortNameFromRef(ref);
  try {
    writeCommand(`$ git checkout ${shortName}`);
    await repo.checkoutBranch(ref, {})
    writeSuccess(`Switched to branch ${chalk.underline(shortName)}`)
  } catch (e) {
    writeError(`Couldn't checkout Branch ${chalk.underline(shortName)}`)
    writeError(e);
  }
}

/**
 * Delete a Branch
 * @param repo 
 * @param ref 
 */
export async function deleteBranch(ref: Reference) {
  const shortName = getShortNameFromRef(ref);

  writeCommand(`$ git branch ${shortName} -D`)
  const del = Branch.delete(ref);
  console.log(del);
  if(del === 0) {
    writeSuccess(`Successfully removed Branch ${chalk.underline(shortName)}`)
  } else {
    writeError(`Couldn't remove Branch ${chalk.underline(shortName)}`)
    writeError(del.toString())
  }
}