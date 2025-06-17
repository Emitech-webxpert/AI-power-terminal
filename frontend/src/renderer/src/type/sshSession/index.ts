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
}
