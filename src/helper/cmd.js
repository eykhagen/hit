import chalk from 'chalk';
/**
 * Checks whether a value is undefined
 * @param {*} value 
 */
export const checkUndefined = (value) => {
  return typeof value === 'undefined';
}

export const writeError = (message) => {
  console.log(`${chalk.red('[Error]')} ${message}`)
}