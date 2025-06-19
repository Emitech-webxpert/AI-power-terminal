export interface SessionData {
  id?: string
  userId: String
  protocol: string
  host: string
  port: string
  username: string
  sessionName: string
  description: string
  step: number
  visible: boolean
}

export interface SessionList {
  isSessionsExpanded: boolean
  isSessionsExpandedInner: boolean
  isSessionWizadOpen: boolean
  isQuickConnectOpen: boolean
  isDuplicateOpen: boolean
  isSessionContextOpen: boolean
  isSessionContextOpenFile: boolean
  selectedFileId: string | null
  isRenameOpen: boolean
  isDeleteOpen: boolean
  deleteTitle: string

  // ADD THESE NEW FIELDS for API integration
  sessions: Session[]
  loading: boolean
  error: string | null
}

export interface Session {
  id?: string
  userId: String
  protocol: string
  host: string
  port: string
  username: string
  sessionName: string
  description: string
}

export interface HostKeyModalProps {
  isOpen: boolean
  hostname: string
  hostKey: string
  onAccept: () => void
  onCancel: () => void
  onViewKey: () => void
}

export interface SSHPasswordModalProps {
  isOpen: boolean
  hostname: string
  username: string
  onSubmit: (password: string, savePassword: boolean) => void
  onCancel: () => void
}

export interface SessionHeaderProps {
  isSessionsExpandedInner: boolean
  sessionsLoading: boolean
  isSessionContextOpen: boolean
  onSessionsClick: () => void
  onSessionsRightClick: (e: React.MouseEvent) => void
  onSessionContextClose: () => void
  onDeleteOpen: (title: string) => void
  onQuickConnectClick: () => void
  onSessionWizardClick: () => void
  onRenameOpen: () => void
}
export interface SessionListProps {
  sessions: Session[]
  sessionsLoading: boolean
  sessionsError: string | null
  isSessionsExpandedInner: boolean
  selectedFileId: string | null
  isSessionContextOpenFile: boolean
  onSessionRightClick: (e: React.MouseEvent, id: string) => void
  onSessionDoubleClick: (session: Session) => void
  onSessionContextCloseFile: () => void
  onDeleteOpen: (title: string) => void
  onDuplicate: () => void
  onRenameOpen: () => void
}