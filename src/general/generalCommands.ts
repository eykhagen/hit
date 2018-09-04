import * as program from 'commander';
import { getGeneralInformation } from './generalModule';

export const initGeneralCommands = async () => {
  program
    .command('info')
    .alias('i')
    .description('Get general information about the repository')
    .action(async () => {
      await getGeneralInformation();
    });
}