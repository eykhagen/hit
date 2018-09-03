import chalk from 'chalk';
import { Repository, Reference, Commit } from 'nodegit';
import { checkUndefined, writeError, writeSuccess, writeCommand } from '../helper/cmd';
import { getShortNameFromRef, deleteBranch as helperDeleteBranch } from '../helper/git';

const Table = require('cli-table3');
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
  const del = helperDeleteBranch(ref);
  if(del === 0) {
    writeSuccess(`Successfully removed Branch ${chalk.underline(shortName)}`)
  } else {
    writeError(`Couldn't remove Branch ${chalk.underline(shortName)}`)
    writeError(del.toString())
  }
}

/**
 * Show a table of all branches in the repository
 */
export async function showListOfBranches(repo: Repository, cmd: any) {

  // notes
  // 1. make the color of the active branch different from the others
  // 2. Colums: name, latestCommit, local/remote
  const allBranches = await repo.getReferences(1)
  let table: Array<any> = new Table({
    head: [chalk.hex('#1abc9c').bold('Name'), chalk.hex('#1abc9c').bold('Latest Commit'), chalk.hex('#1abc9c').bold('Remote/Local')]
  })

  for(const ref of allBranches) {

    let name: string = getShortNameFromRef(ref)
    // convert 0 and 1 to Boolean
    const isActive = Boolean(ref.isHead());
    const isRemote = Boolean(ref.isRemote());

    // get reference latest commit
    const refCommit: Commit = await repo.getReferenceCommit(ref)
    // toString the commit
    let commit = refCommit.id().tostrS().slice(0, 7)

    // highlight the name of the currently active branch
    if(isActive === true) {
      name = chalk.hex('#1abc9c').bold(name)
    }

    // check for remote and change the remote/local string 
    let remoteText: string = 'Local';
    if(isRemote === true) {
      remoteText = 'Remote'
    }

    // change the color of remote branches to grey if the --remoteOnly flag isn't set
    if(isRemote && !isActive && !cmd.remoteOnly) {
      name = chalk.grey(name);
      commit = chalk.grey(commit);
      remoteText = chalk.grey(remoteText);
    }

    // print --remoteOnly branches
    if(cmd.remoteOnly && isRemote) {
      table.push([name, commit , remoteText]);
    }

    // print --localOnly branches
    if(cmd.localOnly && !isRemote) {
      table.push([name, commit , remoteText]);
    }

    // print all branches
    if(!cmd.localOnly && !cmd.remoteOnly) {
      table.push([name, commit ,remoteText]);
    }
    
  }

  console.log(table.toString());

}