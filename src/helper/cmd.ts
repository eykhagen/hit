import chalk from 'chalk';
/**
 * Checks whether a value is undefined
 * @param {*} value 
 */
export const checkUndefined = (value: any) => {
  return typeof value === 'undefined';
}

/**
 * Logs a message with a predefined Error syntax 
 * @param message 
 */
export const writeError = (message: string) => {
  console.log(`${chalk.red('[Error]')} ${chalk.hex("#e74c3c")(message)}`)
}

/**
 * Logs a message with a predefined Success syntax and a green checkmark
 * @param message 
 */
export const writeSuccess = (message: string) => {
  console.log(`[ ${chalk.hex('#16a085')('\u2713')} ] ${chalk.hex('#1abc9c').bold(message)}`);
}

/**
 * Logs which git command(s) is equivalent to the used hit command to let beginners learn those quickly
 * @param message 
 */
export const writeCommand = (message: string) => {
  console.log(chalk.grey.bold(message));
}