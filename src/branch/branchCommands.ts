import * as program from 'commander';
const Confirm = require('prompt-confirm');

import { Repository, Reference} from 'nodegit';
import { createBranch, checkoutBranch, deleteBranch, showListOfBranches, checkoutNewBranch, mergeMasterIntoBranch } from './branchModule';
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
    .description('Create a new branch')
    .action(async (name: string, cmd: any) => {
      if (cmd.use) {
          await checkoutNewBranch(repo, name);
          return;
      }
      await createBranch(repo, name)

    });

  program
    .command('use <name>')
    .alias('u')
    .description('Checkout a branch')
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
              await checkoutNewBranch(repo, name);
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
    .option('-l ,--localOnly', 'Show only local branches')
    .option('-r, --remoteOnly', 'Show only remote branches')
    .description('List all branches and get short information about them')
    .action(async (cmd: any) => {
      await showListOfBranches(repo, cmd);
    })

  program
    .command('master')
    .alias('m')
    .description('Checkout master branch')
    .action(async () => {
      let masterRef: Reference | null = await getBranchRefFromName(repo, 'master');
      if(masterRef !== null) {
        await checkoutBranch(repo, masterRef)
      } else {
        writeError(`Couldn't find ${chalk.underline('master')} Branch`)
      }
    });

  program
    .command('update')
    .description('Merges the current master HEAD commit into the current branch')
    .action(async () => {
      await mergeMasterIntoBranch(repo);
    });

  program.parse(process.argv);
}
