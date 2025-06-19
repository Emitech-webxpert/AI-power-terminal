import React from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { folder } from '@renderer/assets'
import { SessionContextModal } from '@modals/index'
import { SessionHeaderProps } from '@renderer/type/sshSession'

const SessionHeader = React.forwardRef<HTMLDivElement, SessionHeaderProps>(({
  isSessionsExpandedInner,
  sessionsLoading,
  isSessionContextOpen,
  onSessionsClick,
  onSessionsRightClick,
  onSessionContextClose,
  onDeleteOpen,
  onQuickConnectClick,
  onSessionWizardClick,
  onRenameOpen
}, ref) => {
  return (
    <div
      ref={ref}
      className="flex items-center mb-1 cursor-pointer gap-1 border-t border-gray-light pt-2 relative"
      onClick={onSessionsClick}
      onContextMenu={onSessionsRightClick}
    >
      {isSessionsExpandedInner ? (
        <IoMdArrowDropup size={22} className="text-white" />
      ) : (
        <IoMdArrowDropdown size={22} className="text-white" />
      )}
      <img src={folder} className="" alt="folder" title="folder" />
      <span className="text-xs font-medium text-white">
        Sessions {sessionsLoading && '(Loading...)'}
      </span>
      {isSessionContextOpen && (
        <div>
          <SessionContextModal
            isOpen={isSessionContextOpen}
            onClose={onSessionContextClose}
            onDeleteOpen={() => onDeleteOpen('Delete this folder?')}
            onOpenQuickConnect={onQuickConnectClick}
            onOpenSessionWizad={onSessionWizardClick}
            onRenameOpen={onRenameOpen}
          />
        </div>
      )}
    </div>
  )
})

SessionHeader.displayName = 'SessionHeader'

export default SessionHeader