// components/sidebar/sessionManagement/SessionList/index.tsx
import React from 'react'
import { file } from '@renderer/assets'
import { Session } from '@renderer/type/sshSession'
import { SessionContextFileModal } from '@modals/index'

interface SessionListProps {
  sessions: Session[]
  sessionsLoading: boolean
  sessionsError: string | null
  isSessionsExpandedInner: boolean
  selectedFileId: string | null
  isSessionContextOpenFile: boolean
  // ✅ Remove sessionFileModalRef from props
  onSessionRightClick: (e: React.MouseEvent, id: string) => void
  onSessionDoubleClick: (session: Session) => void
  onSessionContextCloseFile: () => void
  onDeleteOpen: (title: string) => void
  onDuplicate: () => void
  onRenameOpen: () => void
}

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  sessionsLoading,
  sessionsError,
  isSessionsExpandedInner,
  selectedFileId,
  isSessionContextOpenFile,
  onSessionRightClick,
  onSessionDoubleClick,
  onSessionContextCloseFile,
  onDeleteOpen,
  onDuplicate,
  onRenameOpen
}) => {
  if (!isSessionsExpandedInner) return null

  return (
    <div className="ml-6 space-y-1 max-h-64 h-auto min-h-8 overflow-auto overflow-x-visible">
      {sessionsLoading ? (
        <div className="text-xs text-light">Loading sessions...</div>
      ) : sessions?.length === 0 ? (
        <div className="text-xs text-light">
          {sessionsError ? 'Failed to load sessions' : 'No sessions found'}
        </div>
      ) : (
        sessions.map((session, index) => (
          <div
            key={session?.id || `session-${index}`}
            className="file-item flex items-center cursor-pointer px-2 py-1 rounded relative"
            onContextMenu={(e) => session?.id && onSessionRightClick(e, session.id)}
            onDoubleClick={() => onSessionDoubleClick(session)}
          >
            <div className="mr-1">
              <img src={file} className="" title="file" alt="file" />
            </div>
            <span className="text-xs text-light truncate">
              {session?.sessionName || 'Unknown Session'}
            </span>
            {selectedFileId === session?.id && isSessionContextOpenFile && (
              <div> {/* ✅ Remove ref from here */}
                <SessionContextFileModal
                  isOpen={isSessionContextOpenFile}
                  onClose={onSessionContextCloseFile}
                  onDeleteOpen={() => onDeleteOpen('Delete this file?')}
                  onDuplicate={onDuplicate}
                  onRenameOpen={onRenameOpen}
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default SessionList