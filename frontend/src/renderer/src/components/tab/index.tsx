import React, { useEffect, useState } from 'react'
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

const TerminalTabs: React.FC<TerminalTabsProps> = ({ className }) => {
  const dispatch = useAppDispatch()
  const terminals = useAppSelector(selectTerminals)
  const activeTerminalId = useAppSelector(selectActiveTerminalId)

  // SSH Modal states (only for SSH2 protocol)
  const [sshPasswordModal, setSSHPasswordModal] = useState<{
    isOpen: boolean
    terminalId: string
    hostname: string
    username: string
  }>({ isOpen: false, terminalId: '', hostname: '', username: '' })

  const [hostKeyModal, setHostKeyModal] = useState<{
    isOpen: boolean
    terminalId: string
    hostname: string
    hostKey: string
  }>({ isOpen: false, terminalId: '', hostname: '', hostKey: '' })

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

  // Create local terminal (existing functionality)
  const createTerminal = () => {
    const newTerminal = {
      id: `terminal-${Date.now()}`,
      title: 'Connecting...',
      type: 'local' as const
    }
    dispatch(addTerminal(newTerminal))
  }

  // Create remote terminal (SSH2 or Telnet)
  const createRemoteTerminal = (connectionParams: {
    protocol: 'SSH2' | 'Telnet'
    host: string
    username?: string
    port: number
  }) => {
    const terminalId = `${connectionParams.protocol.toLowerCase()}-terminal-${Date.now()}`
    
    let title: string
    let terminalType: 'ssh' | 'telnet'
    
    if (connectionParams.protocol === 'SSH2') {
      title = `${connectionParams.username}@${connectionParams.host}`
      terminalType = 'ssh'
    } else {
      title = `telnet://${connectionParams.host}:${connectionParams.port}`
      terminalType = 'telnet'
    }
    
    // Use addSSHTerminal for both SSH and Telnet (it's a generic remote terminal action)
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
  }

  // SSH Modal handlers (only for SSH2 protocol)
  const handleSSHPasswordSubmit = async (password: string) => {
    if (sshPasswordModal.terminalId) {
      const terminalAPI = ((window as unknown) as { api: { terminal: any } }).api.terminal
      await terminalAPI.submitSSHPassword(sshPasswordModal.terminalId, password)
      setSSHPasswordModal({ isOpen: false, terminalId: '', hostname: '', username: '' })
    }
  }

  const handleSSHPasswordCancel = () => {
    setSSHPasswordModal({ isOpen: false, terminalId: '', hostname: '', username: '' })
  }

  const handleHostKeyAccept = async () => {
    if (hostKeyModal.terminalId) {
      const terminalAPI = ((window as unknown) as { api: { terminal: any } }).api.terminal
      await terminalAPI.acceptSSHHostKey(hostKeyModal.terminalId)
      setHostKeyModal({ isOpen: false, terminalId: '', hostname: '', hostKey: '' })
    }
  }

  const handleHostKeyCancel = () => {
    setHostKeyModal({ isOpen: false, terminalId: '', hostname: '', hostKey: '' })
  }

  const handleHostKeyView = () => {
    // You can implement a detailed host key view here
    console.log('Host key:', hostKeyModal.hostKey)
  }

  const handleUpdateTerminalTitle = (terminalId: string, newTitle: string) => {
    dispatch(updateTerminalTitle({ id: terminalId, title: newTitle }))
  }

  const handleCloseTerminal = (terminalId: string) => {
    dispatch(removeTerminal(terminalId))
  }

  const handleSetActiveTerminal = (terminalId: string) => {
    dispatch(setActiveTerminal(terminalId))
  }

  const confirmCloseTerminal = () => {
    if (terminalToClose) {
      handleCloseTerminal(terminalToClose)
      setIsCloseOpen(false)
      setTerminalToClose(null)
    }
  }

  useEffect(() => {
    const terminalAPI = ((window as unknown) as { api: { terminal: any } }).api.terminal

    // Expose functions to window for external access
    ;(window as { 
      createLocalShell?: () => void
      createRemoteTerminal?: (connectionParams: any) => void 
    }).createLocalShell = createTerminal
    ;(window as { 
      createLocalShell?: () => void
      createRemoteTerminal?: (connectionParams: any) => void 
    }).createRemoteTerminal = createRemoteTerminal

    // Listen for SSH authentication events (only for SSH2 protocol)
    const passwordCleanup = terminalAPI.onSSHPasswordRequired((terminalId: string, data: { hostname: string, username: string }) => {
      setSSHPasswordModal({
        isOpen: true,
        terminalId,
        hostname: data.hostname,
        username: data.username
      })
    })

    const hostKeyCleanup = terminalAPI.onSSHHostVerificationRequired((terminalId: string, data: { hostname: string, hostKey: string }) => {
      setHostKeyModal({
        isOpen: true,
        terminalId,
        hostname: data.hostname,
        hostKey: data.hostKey
      })
    })

    return () => {
      passwordCleanup()
      hostKeyCleanup()
    }
  }, [])

  return (
    <div className={`terminal-tabs-wrapper text-white flex flex-col h-screen ${className}`}>
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
                <span className={`dots ${
                  terminal.type === 'ssh' ? 'blue' : 
                  (terminal.type as string) === 'telnet' ? 'green' : ''
                }`}></span>
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

      <div className="terminal-instance-container terminal-dark-bg h-full flex-1 ">
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

      {/* SSH Authentication Modals - Only for SSH2 protocol */}
      <SSHPasswordModal
        isOpen={sshPasswordModal.isOpen}
        hostname={sshPasswordModal.hostname}
        username={sshPasswordModal.username}
        onSubmit={handleSSHPasswordSubmit}
        onCancel={handleSSHPasswordCancel}
      />

      <HostKeyModal
        isOpen={hostKeyModal.isOpen}
        hostname={hostKeyModal.hostname}
        hostKey={hostKeyModal.hostKey}
        onAccept={handleHostKeyAccept}
        onCancel={handleHostKeyCancel}
        onViewKey={handleHostKeyView}
      />

      {/* Existing Modals */}
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