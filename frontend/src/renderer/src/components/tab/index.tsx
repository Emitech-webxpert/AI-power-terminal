import React, { useEffect } from 'react'
import TerminalInstance from '@renderer/components/terminalInstance'
import type { TerminalTabsProps } from '@renderer/type/terminal'
import { useAppDispatch, useAppSelector } from '@renderer/store/hooks'
import {
  addTerminal,
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
import { useTerminalTabs } from '@renderer/hooks/terminalTab'

const TerminalTabs: React.FC<TerminalTabsProps> = ({ className }) => {
  const dispatch = useAppDispatch()
  const terminals = useAppSelector(selectTerminals)
  const activeTerminalId = useAppSelector(selectActiveTerminalId)

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

  const createTerminal = () => {
    const newTerminal = {
      id: `terminal-${Date.now()}`,
      title: 'Connecting...'
    }
    dispatch(addTerminal(newTerminal))
    console.log('Created terminal via Redux:', newTerminal.id)
  }

  const handleUpdateTerminalTitle = (terminalId: string, newTitle: string) => {
    dispatch(updateTerminalTitle({ id: terminalId, title: newTitle }))
  }

  const handleCloseTerminal = (terminalId: string) => {
    dispatch(removeTerminal(terminalId))
    console.log('Closed terminal via Redux:', terminalId)
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
    ;(window as { createLocalShell?: () => void }).createLocalShell = createTerminal
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
                <span className="dots"></span>
                {/* <span className="dots green"></span> */}
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
              onClose={() => handleCloseTerminal(terminal.id)}
              onTitleChange={(title) => handleUpdateTerminalTitle(terminal.id, title)}
            />
          </div>
        ))}
      </div>

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