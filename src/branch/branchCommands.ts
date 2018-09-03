const program = require('commander');
const Confirm = require('prompt-confirm');

import { Repository, Reference} from 'nodegit';
import { createBranch, checkoutBranch, deleteBranch, showListOfBranches } from './branchModule';
import { openRepository , getBranchRefFromName } from '../helper/git';
import { writeError } from '../helper/cmd';
import chalk from 'chalk';


export const initBranchCommands = async () => {
  // register the hit branch command
  const repo: Repository | undefined = await openRepository()
  if(typeof repo === 'undefined') {
    return;
  }
  
  program
    .command('add <name>')
    .option('-u, --use', 'Checkout the branch on creation')
    .action(async (name: string, cmd: any) => {
      const addRef: Reference | null = await createBranch(repo, name)
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
            const addRef: Reference | null = await createBranch(repo, name);
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
  program
    .command('remove <name>')
    .alias('rm')
    .description('Remove a branch')
    .action(async (name: string) => {
      let rmBranchRef: Reference | null = await getBranchRefFromName(repo, name);
      if(rmBranchRef !== null) {
        await deleteBranch(rmBranchRef)
      } else {
        writeError(`Couldn't find Branch ${chalk.underline(name)}`)
      }
    });

  program
    .command('list')
    .alias('ls')
    .description('List all branches and get short information about them')
    .action(async () => {
      await showListOfBranches(repo);
    })
  program.parse(process.argv);
}
