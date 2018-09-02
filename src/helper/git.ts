import { Repository } from 'nodegit';
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
  }
}