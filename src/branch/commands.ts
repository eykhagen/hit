const program = require('commander');
import { createBranch, checkoutBranch } from './module';

export const initBranchCommands = () => {
  // register the hit branch command
  program
  .command('branch [subcommand] [parameter]')
  // --u option is only available with hit branch <branch_name> -u command 
  .option('-u, --use', 'Create and use a branch with one command (only available with commands that create a branch)')
  .alias('b')
  .description('Create, use, modify and merge branches')
  .action(async (subcommand: string, parameter: string, cmd: any) => {
    switch(subcommand) {
      
      case 'add':
        // create a branch
        const addRef = await createBranch(parameter)
        if (cmd.use) {
          if(addRef !== null) {
            await checkoutBranch(addRef);
          }
        }
        break;
      
      default:
        /* also create a branch without using the add keyword
         * e.g. 'hit branch newBranchName' would also create a new branch
        */

        // use subcommand instead of parameter because in this case the "subcommand" is the parameter so the name of the new branch
        const defaultRef = await createBranch(subcommand)
        if (cmd.use) {
          if(defaultRef !== null) {
            await checkoutBranch(defaultRef);
          }
        }
        break;
    }
  });


  program.parse(process.argv);
}
