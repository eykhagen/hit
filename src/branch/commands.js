import program from 'commander';

import { createBranch, checkoutBranch } from './module';

export const initBranchCommands = () => {

  // register the hit branch command
  program
  .command('branch [subcommand] [parameter]')
  // --u option is only available with hit branch <branch_name> -u command 
  .option('-u, --use', 'Create and use a branch with one command (only available with commands that create a branch)')
  .alias('b')
  .description('Create, use, modify and merge branches')
  .action(async (subcommand, parameter, cmd) => {
    switch(subcommand) {
      case 'add':
        // create a branch
        const reference = await createBranch(parameter)
        if (cmd.use) {
          await checkoutBranch(reference);
        }
    }
  });


  program.parse(process.argv);
}
