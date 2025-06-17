
import React from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { folder } from '@renderer/assets'
import { SessionContextModal } from '@modals/index'

interface SessionHeaderProps {
  isSessionsExpandedInner: boolean
  sessionsLoading: boolean
  isSessionContextOpen: boolean
  // ✅ Remove sessionModalRef from props - no longer needed
  onSessionsClick: () => void
  onSessionsRightClick: (e: React.MouseEvent) => void
  onSessionContextClose: () => void
  onDeleteOpen: (title: string) => void
  onQuickConnectClick: () => void
  onSessionWizardClick: () => void
  onRenameOpen: () => void
}

const SessionHeader: React.FC<SessionHeaderProps> = ({
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
}) => {
  return (
    <div
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
        <div> {/* ✅ Remove ref from here */}
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
}

export default SessionHeader