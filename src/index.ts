#!/usr/bin/env node
import { initBranchCommands } from './branch/branchCommands';
import { initGeneralCommands } from './general/generalCommands';
initBranchCommands();
initGeneralCommands();