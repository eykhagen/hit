const program = require('commander');
import { Repository, Reference } from 'nodegit';
import { createBranch, checkoutBranch } from './module';
import { openRepository } from '../helper/git';
import { checkUndefined, writeError } from './../helper/cmd';
import chalk from 'chalk';

export const initBranchCommands = () => {
  // register the hit branch command
  program
  .command('branch [subcommand] [parameter]')
  // --u option is only available with hit branch <branch_name> -u command 
  .option('-u, --use', 'Create and use a branch with one command (only available with commands that create a branch)')
  .alias('b')
  .description('Create, use, modify and merge branches')
  .action(async (subcommand: string, parameter: string, cmd: any) => {
    // open the repo first
    const repo: Repository = await openRepository()
    if(checkUndefined(repo)) {
      return;
    }

    switch(subcommand) {
      // create a branch
      case 'add':
        const addRef = await createBranch(repo, parameter)
        if (cmd.use) {
          if(addRef !== null) {
            await checkoutBranch(repo, addRef);
          }
        }
        break;

      case 'use':
        let branchRef: Reference | null = null;
        try {
          // get ref from name
          branchRef = await repo.getBranch(parameter);
        } catch(e) {
          // could't find branch
          writeError(`Couldn't find Branch ${chalk.underline(parameter)}`)
        }
        if(branchRef !== null) {
          // checkout the branch
          await checkoutBranch(repo, branchRef);
        }
        break;

      default:
        /* also create a branch without using the add keyword
         * e.g. 'hit branch newBranchName' would also create a new branch
        */
        // use subcommand instead of parameter because in this case the "subcommand" is the parameter so the name of the new branch
        const defaultRef = await createBranch(repo, subcommand)
        if (cmd.use) {
          if(defaultRef !== null) {
            await checkoutBranch(repo, defaultRef);
          }
        }
        break;
    }
  });


  program.parse(process.argv);
}
