const program = require('commander');
const Confirm = require('prompt-confirm');

import { Repository } from 'nodegit';
import { createBranch, checkoutBranch, deleteBranch } from './module';
import { openRepository , getBranchRefFromName } from '../helper/git';
import { checkUndefined} from './../helper/cmd';
import chalk from 'chalk';


export const initBranchCommands = async () => {
  // register the hit branch command
  const repo: Repository = await openRepository()
  if(checkUndefined(repo)) {
    return;
  }
  
  program
    .command('add <name>')
    .option('-u, --use', 'Checkout the branch on creation')
    .action(async (name: string, cmd: any) => {
      const addRef = await createBranch(repo, name)
      if (cmd.use) {
        if(addRef !== null) {
          await checkoutBranch(repo, addRef);
        }
      }
    });

  program
    .command('use <name>')
    .option('-y, --yes', `Skip the yes/no prompt if the branch doesn't exist and create it`)
    .action(async (name: string, cmd: any) => {
      // check whether the branch exists
      const branchRef = await getBranchRefFromName(repo, name);
      
      // if the ref doesn't exist
      if(branchRef === null) {
        if(!cmd.yes) {
          const prompt = new Confirm(chalk.hex('#1abc9c').bold(`The branch ${chalk.underline(name)} doesn't exist. Do you want to create it?`));
          const answer = await prompt.run();
          if(answer === true) {
            const addRef = await createBranch(repo, name);
            if(addRef !== null) {
              await checkoutBranch(repo, addRef);
            }
          }
        }
        return;
      } 

      await checkoutBranch(repo, branchRef);
      return;
    })
  program.parse(process.argv);
}
