import React, { useEffect, useState, useCallback } from 'react'
import TerminalInstance from '@renderer/components/terminalInstance'
import type { TerminalTabsProps } from '@renderer/type/terminal'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  addTerminal,
  addSSHTerminal,
  removeTerminal,
  setActiveTerminal,
  updateTerminalTitle,
  selectTerminals,
  selectActiveTerminalId
} from '@renderer/store/slices/terminalSlice'
import {
  CloseModal,
  DisconnectModal,
  NameModal,
  RenameModal,
  TabContextModal
} from '@modals/index'
import HostKeyModal from '@modals/hostAuthentication'
import SSHPasswordModal from '@modals/sshPassword'
import { useTerminalTabs } from '@renderer/hooks/terminalTab'
import {ConnectionParams,SSHPasswordModalState,HostKeyModalState,SSHPasswordData,SSHHostKeyData,BasicResponse} from '@shared/type'


interface TerminalAPI {
  submitSSHPassword: (terminalId: string, password: string) => Promise<BasicResponse>
  acceptSSHHostKey: (terminalId: string) => Promise<BasicResponse>
  onSSHPasswordRequired: (callback: (terminalId: string, data: SSHPasswordData) => void) => (() => void)
  onSSHHostVerificationRequired: (callback: (terminalId: string, data: SSHHostKeyData) => void) => (() => void)
}

const TerminalTabs: React.FC<TerminalTabsProps> = ({ className }) => {
  const dispatch = useAppDispatch()
  const terminals = useAppSelector(selectTerminals)
  const activeTerminalId = useAppSelector(selectActiveTerminalId)

  // Initial modal states
  const initialSSHModalState: SSHPasswordModalState = { isOpen: false, terminalId: '', hostname: '', username: '' }
  const initialHostKeyModalState: HostKeyModalState = { isOpen: false, terminalId: '', hostname: '', hostKey: '' }

  // SSH Modal states
  const [sshPasswordModal, setSSHPasswordModal] = useState<SSHPasswordModalState>(initialSSHModalState)
  const [hostKeyModal, setHostKeyModal] = useState<HostKeyModalState>(initialHostKeyModalState)

  const {
    tabBarRef,
    sessionModalRef,
    isSessionContextOpen,
    contextMenuPosition,
    isRenameOpen,
    isNameOpen,
    isDisconnectOpen,
    isCloseOpen,
    terminalToClose,
    handleWheel,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
    handleSessionsRightClick,
    handleRenameOpen,
    handleNameOpen,
    handleDisconnectOpen,
    handleCloseOpen,
    setIsSessionContextOpen,
    setIsRenameOpen,
    setIsNameOpen,
    setIsDisconnectOpen,
    setIsCloseOpen,
    setTerminalToClose
  } = useTerminalTabs()

  // Helper function to safely get terminal API
  const getTerminalAPI = useCallback((): TerminalAPI | null => {
    return window.api?.terminal || null
  }, [])

  // Helper functions to reset modal states
  const resetSSHPasswordModal = useCallback(() => setSSHPasswordModal(initialSSHModalState), [])
  const resetHostKeyModal = useCallback(() => setHostKeyModal(initialHostKeyModalState), [])

  // Create local terminal
  const createTerminal = useCallback(() => {
    const newTerminal = {
      id: `terminal-${Date.now()}`,
      title: 'Connecting...',
      type: 'local' as const
    }
    dispatch(addTerminal(newTerminal))
  }, [dispatch])

  // Create remote terminal (SSH2 or Telnet)
  const createRemoteTerminal = useCallback((connectionParams: ConnectionParams) => {
    const terminalId = `${connectionParams.protocol.toLowerCase()}-terminal-${Date.now()}`
    
    // Generate title based on protocol
    const title = connectionParams.protocol === 'SSH2' 
      ? `${connectionParams.username}@${connectionParams.host}`
      : `telnet://${connectionParams.host}:${connectionParams.port}`
    
    dispatch(addSSHTerminal({
      id: terminalId,
      title,
      sshParams: {
        protocol: connectionParams.protocol,
        host: connectionParams.host,
        username: connectionParams.username || '',
        port: connectionParams.port
      }
    }))
  }, [dispatch])

  // SSH Modal handlers
  const handleSSHPasswordSubmit = useCallback(async (password: string) => {
    const terminalAPI = getTerminalAPI()
    if (sshPasswordModal.terminalId && terminalAPI) {
      try {
        await terminalAPI.submitSSHPassword(sshPasswordModal.terminalId, password)
        resetSSHPasswordModal()
      } catch (error) {
        console.error('SSH password submission failed:', error)
      }
    }
  }, [sshPasswordModal.terminalId, getTerminalAPI, resetSSHPasswordModal])

  const handleHostKeyAccept = useCallback(async () => {
    const terminalAPI = getTerminalAPI()
    if (hostKeyModal.terminalId && terminalAPI) {
      try {
        await terminalAPI.acceptSSHHostKey(hostKeyModal.terminalId)
        resetHostKeyModal()
      } catch (error) {
        console.error('SSH host key acceptance failed:', error)
      }
    }
  }, [hostKeyModal.terminalId, getTerminalAPI, resetHostKeyModal])

  const handleHostKeyView = useCallback(() => {
    console.log('Host key:', hostKeyModal.hostKey)
  }, [hostKeyModal.hostKey])

  // Terminal management handlers
  const handleUpdateTerminalTitle = useCallback((terminalId: string, newTitle: string) => {
    dispatch(updateTerminalTitle({ id: terminalId, title: newTitle }))
  }, [dispatch])

  const handleCloseTerminal = useCallback((terminalId: string) => {
    dispatch(removeTerminal(terminalId))
  }, [dispatch])

  const handleSetActiveTerminal = useCallback((terminalId: string) => {
    dispatch(setActiveTerminal(terminalId))
  }, [dispatch])

  const confirmCloseTerminal = useCallback(() => {
    if (terminalToClose) {
      handleCloseTerminal(terminalToClose)
      setIsCloseOpen(false)
      setTerminalToClose(null)
    }
  }, [terminalToClose, handleCloseTerminal, setIsCloseOpen, setTerminalToClose])

  // Helper function to get dot color based on terminal type
  const getDotColor = useCallback((type: string): string => {
    switch (type) {
      case 'ssh': return 'blue'
      case 'telnet': return 'green'
      default: return ''
    }
  }, [])

  // Setup effect for window functions and SSH listeners
  useEffect(() => {
    const terminalAPI = getTerminalAPI()
    if (!terminalAPI) {
      console.warn('Terminal API not available')
      return
    }

    // Expose functions to window for external access (type-safe)
    if (typeof window !== 'undefined') {
      (window as any).createLocalShell = createTerminal;
      (window as any).createRemoteTerminal = createRemoteTerminal;
    }

    // Set up SSH event listeners
    let passwordCleanup: (() => void) | undefined
    let hostKeyCleanup: (() => void) | undefined

    try {
      passwordCleanup = terminalAPI.onSSHPasswordRequired(
        (terminalId: string, data: SSHPasswordData) => {
          setSSHPasswordModal({
            isOpen: true,
            terminalId,
            hostname: data.hostname,
            username: data.username
          })
        }
      )

      hostKeyCleanup = terminalAPI.onSSHHostVerificationRequired(
        (terminalId: string, data: SSHHostKeyData) => {
          setHostKeyModal({
            isOpen: true,
            terminalId,
            hostname: data.hostname,
            hostKey: data.hostKey
          })
        }
      )
    } catch (error) {
      console.error('Error setting up SSH listeners:', error)
    }

    return () => {
      try {
        passwordCleanup?.()
        hostKeyCleanup?.()
      } catch (error) {
        console.error('Error cleaning up SSH listeners:', error)
      }
    }
  }, [createTerminal, createRemoteTerminal, getTerminalAPI])

  return (
    <div className={`terminal-tabs-wrapper text-white flex flex-col h-screen ${className}`}>
      {/* Terminal Tabs Bar */}
      {terminals.length > 0 && (
        <div
          ref={tabBarRef}
          className={`terminal-tab-bar scrollbar-hide flex items-center bg-transparent relative ${
            isSessionContextOpen === true ? 'overflow-visible' : 'overflow-auto'
          }`}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {terminals.map((terminal) => (
            <div
              key={terminal.id}
              className={`terminal-tabs gap-4 flex items-center cursor-pointer text-xs py-2 px-4 rounded-tl-xl rounded-tr-xl ${
                activeTerminalId === terminal.id
                  ? 'active terminal-dark-bg'
                  : 'terminal-tab opacity-60'
              }`}
              onClick={() => handleSetActiveTerminal(terminal.id)}
              onContextMenu={handleSessionsRightClick}
            >
              <span className="flex gap-1 justify-center items-center">
                <span className={`dots ${getDotColor(terminal.type)}`}></span>
                {terminal.title}
              </span>

              <button
                className="terminal-tab-close flex items-center border-0 rounded-sm px-1 py-0 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCloseOpen(terminal.id)
                }}
                title="Close Terminal"
              >
                ×
              </button>
            </div>
          ))}

          {/* Context Menu */}
          {isSessionContextOpen && (
            <div
              ref={sessionModalRef}
              style={{
                position: 'absolute',
                left: contextMenuPosition.x,
                top: contextMenuPosition.y,
                zIndex: 50
              }}
            >
              <TabContextModal
                isOpen={isSessionContextOpen}
                onClose={() => setIsSessionContextOpen(false)}
                onRenameOpen={handleRenameOpen}
                onNameOpen={handleNameOpen}
                onDisconnectOpen={handleDisconnectOpen}
              />
            </div>
          )}
        </div>
      )}

      {/* Terminal Instances */}
      <div className="terminal-instance-container terminal-dark-bg h-full flex-1">
        {terminals.map((terminal) => (
          <div
            key={terminal.id}
            className={`terminal-instance ${terminal.id === activeTerminalId ? 'block' : 'hidden'}`}
          >
            <TerminalInstance
              terminalId={terminal.id}
              terminalType={terminal.type}
              sshParams={terminal.sshParams}
              onClose={() => handleCloseTerminal(terminal.id)}
              onTitleChange={(title) => handleUpdateTerminalTitle(terminal.id, title)}
            />
          </div>
        ))}
      </div>

      {/* SSH Authentication Modals */}
      <SSHPasswordModal
        isOpen={sshPasswordModal.isOpen}
        hostname={sshPasswordModal.hostname}
        username={sshPasswordModal.username}
        onSubmit={handleSSHPasswordSubmit}
        onCancel={resetSSHPasswordModal}
      />

      <HostKeyModal
        isOpen={hostKeyModal.isOpen}
        hostname={hostKeyModal.hostname}
        hostKey={hostKeyModal.hostKey}
        onAccept={handleHostKeyAccept}
        onCancel={resetHostKeyModal}
        onViewKey={handleHostKeyView}
      />

      {/* Other Modals */}
      <RenameModal isOpen={isRenameOpen} onClose={() => setIsRenameOpen(false)} />
      <NameModal isOpen={isNameOpen} onClose={() => setIsNameOpen(false)} />
      <CloseModal
        isOpen={isCloseOpen}
        onClose={() => { setIsCloseOpen(false); setTerminalToClose(null) }}
        onConfirm={confirmCloseTerminal}
      />
      <DisconnectModal 
        isOpen={isDisconnectOpen} 
        onClose={() => setIsDisconnectOpen(false)} 
      />
    </div>
  )
}

export default TerminalTabs