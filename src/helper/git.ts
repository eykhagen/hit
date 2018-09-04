import { Repository, Reference, Branch, Remote } from 'nodegit';
import { writeError } from './cmd';
/**
 * Opens the repository at the cwd and returns it to work with ti
 */
export async function openRepository() {
  try {
    return await Repository.open(process.cwd())
  } catch(e) {
    writeError(`Couldn't open Repository`)
    writeError(e)
    return undefined;
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
    return branchRef;
  }
}

export function getShortNameFromRef(ref: Reference) {
  const split = ref.name().split('/');
  const len = split.length;
  return split[len-1];
}

export function deleteBranch(ref: Reference){
  return Branch.delete(ref);
}

export async function getRemoteOrigin(repo: Repository) {
  return await Remote.lookup(repo, 'origin', () => true)
}