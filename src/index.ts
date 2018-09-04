#!/usr/bin/env node
import { initBranchCommands } from './branch/branchCommands';
import { initGeneralCommands } from './general/generalCommands';
import * as program from 'commander';

const init = async () => {
  await initBranchCommands();
  await initGeneralCommands();
} 

init().then(() => {
  program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    program.help()
  });
  if(process.argv.length === 2){
    program.help();
  }
})

