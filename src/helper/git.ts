import { Repository, Reference } from 'nodegit';
import { writeError } from './cmd';
import chalk from 'chalk';
/**
 * Opens the repository at the cwd and returns it to work with ti
 */
export async function openRepository() {
  try {
    return await Repository.open(process.cwd())
  } catch(e) {
    writeError(`Couldn't open Repository`)
    writeError(e)
  }
}

/**
 * Get a Nodegit Reference from a string-name
 * @param repo 
 * @param name 
 */
export async function getBranchRefFromName(repo: Repository, name: string) {
  let branchRef: Reference | null = null;
  try {
    // get ref from name
    branchRef = await repo.getBranch(name);
    return branchRef;
  } catch(e) {
    // could't find branch
    writeError(`Couldn't find Branch ${chalk.underline(name)}`)
    return branchRef;
  }
}

export function getShortNameFromRef(ref: Reference) {
  const split = ref.name().split('/');
  const len = split.length;
  return split[len-1];
}