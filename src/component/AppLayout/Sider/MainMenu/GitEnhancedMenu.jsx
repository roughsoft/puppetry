import React from "react";
import { message } from "antd";
import { ipcRenderer } from "electron";
import { E_GIT_INIT, E_GIT_SYNC, E_GIT_PUSH, E_GIT_LOG, E_GIT_LOG_RESPONSE } from "constant";


export class GitEnhancedMenu extends React.Component {


  onFileGitCheckout = () => {
    this.props.action.updateApp({ gitCheckoutModal: true });
    setTimeout(() => {
      ipcRenderer.send(
          E_GIT_LOG,
          this.props.projectDirectory
      );
      ipcRenderer.removeAllListeners( E_GIT_LOG_RESPONSE );
      ipcRenderer.on( E_GIT_LOG_RESPONSE, ( ev, logs ) => {
        this.props.action.updateApp({ gitLogs: logs });
      });
    }, 10 );
  }

  onFileGitCommit = () => {
    this.props.action.updateApp({ newGitCommitModal: true });
  }

  onFileGitSync = () => {
    const { git } = this.props.project;
    ipcRenderer.send( E_GIT_SYNC, this.props.projectDirectory, {
      credentialsUsername: git.credentialsUsername,
      credentialsPassword: git.credentialsPassword,
      credentialsAcccessToken: git.credentialsAcccessToken
   });
  }

  onFileGitInitialize = () => {
    const { projectDirectory } = this.props,
          { git } = this.props.project;

    if ( !projectDirectory ) {
      message.error( "Project directory is not specified" );
      return;
    }

    if ( !git.configUsername.trim() || !git.configEmail.trim() ) {
      message.error( "You need to provide GIT configuration first" );
      this.props.action.addAppTab( "settings" );
      return;
    }

    ipcRenderer.send( E_GIT_INIT, projectDirectory );
    this.props.action.saveProjectGit({ initialized: true });
  }

}