import chalk from 'chalk';
import { writeSuggestion, writeCommand } from './../helper/cmd';
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
  let masterCommitInColor = chalk.hex('#FFA500')(masterCommitShortSha);
  if(refCommitIsUpToDate === true) {
    // ... green if they do match
    masterCommitInColor = chalk.green(masterCommitShortSha);
  }

  // head commit
  writeInfoMessage('Head Commit', `${refCommitShortSha} ${chalk.grey('[master ' + masterCommitInColor + ']')}` )
  
  // get remotes
  const remoteOrigin = await getRemoteOrigin(repo);

  // if origin was found
  if(typeof remoteOrigin.url !== 'undefined') {
    // get remote master head commit
    const remoteMaster = await repo.getReference('refs/remotes/origin/master');
    const remoteMasterCommit = await repo.getReferenceCommit(remoteMaster);
    const remoteMasterCommitShortSha = remoteMasterCommit.sha().slice(0, 7);

    // check whether the remote master head commit is up to date with the local master head or newer/older
    let remoteMasterCommitInColor = chalk.hex('#FFA500')(remoteMasterCommitShortSha);
    if(remoteMasterCommitShortSha === masterCommitShortSha) {
      remoteMasterCommitInColor = chalk.green(remoteMasterCommitShortSha)
    }
  
    writeInfoMessage('Remote origin', `${remoteOrigin.url()} ${chalk.grey('[master ' + remoteMasterCommitInColor + ']')}`)
    if(remoteMasterCommitShortSha !== masterCommitShortSha) {
      console.log();
      writeSuggestion(`Remote ${chalk.underline('master')} and local ${chalk.underline('master')} differ. Consider to fetch/push the changes`);
      // writeSuggestion(chalk.bold('$ hit remote pull'))
      // writeSuggestion(chalk.bold('$ hit remote push'))
    }
  } else {
    writeInfoMessage('Remote origin', 'none')
  }

  console.log();


}