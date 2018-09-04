import chalk from 'chalk';
import { writeError } from './../helper/cmd';
import { Repository, Reference, Commit} from 'nodegit';
import { openRepository, getBranchRefFromName, getShortNameFromRef, getRemoteOrigin } from "../helper/git";

export const getGeneralInformation = async () => {
  /* information to show:
   * - current branch
   * - latest commit
   * - remote origin (if exists)
   * - how many commits ahead or behind of master (if it's a branch)
   * - if it the commit is ahead or behind of origin/master
  */ 

  // open repo
  const repo: Repository | undefined = await openRepository();
  if(typeof repo === 'undefined'){
    return;
  }

  // get current branch
  const currentBranch: Reference = await repo.getCurrentBranch();

  // branch name
  const branchName = getShortNameFromRef(currentBranch);
  // get latest branch commit
  const refCommit: Commit = await repo.getReferenceCommit(currentBranch);
  const refCommitShortSha = refCommit.sha().slice(0, 7);
  // get master commit
  const masterCommit: Commit = await repo.getMasterCommit();
  const masterCommitShortSha = masterCommit.sha().slice(0, 7);
  // whether the branch has the latest commit from master
  const refCommitIsUpToDate: boolean = refCommitShortSha === masterCommitShortSha;


  const writeInfoMessage = (param1: string, param2: string) => {
    console.log(`[ ${chalk.hex('#16a085').bold('info')} ] ${chalk.hex('#1abc9c').bold(param1)} -> ${chalk.hex('#1abc9c')(param2)}`);
  }
  // empty line
  console.log();
  
  // current branch name
  writeInfoMessage('Current branch', branchName)

  // color of master will be red if the head commit of branch and master doesn't match 
  let masterCommitInColor = chalk.red(masterCommitShortSha);
  if(refCommitIsUpToDate === true) {
    // ... green if they do match
    masterCommitInColor = chalk.green(masterCommitShortSha);
  }

  // head commit
  writeInfoMessage('Head Commit', `${refCommitShortSha} ${chalk.grey('[master ' + masterCommitInColor + ']')}` )
  
  // get remotes
  const remoteOrigin = await getRemoteOrigin(repo);
  
  writeInfoMessage('Remote origin', `${remoteOrigin.url()}`)

  console.log();


}