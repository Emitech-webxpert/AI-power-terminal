export interface NavBarProps {
  isDarkMode?: boolean
  onThemeToggle?: () => void
  onShare?: () => void
  onFastBoot?: () => void
  userInitials?: string
  userName?: string
  showWindowControls?: boolean
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
}

export interface SessionManagerProps {
  isVisible: boolean
  setVisible: () => void
  onQuickConnect: () => void
}

export interface WorkflowManagerProps {
  toggleWorkflowVisibility: () => void
  onContextMenuToggle?: (isOpen: boolean) => void // Add new prop
  sidebarOnRight?: boolean
}

export interface SessionToolbarProps {
  onSessionWizadClick: () => void
}

export interface Step1Props {
  selectedProtocol: string
  setSelectedProtocol: React.Dispatch<React.SetStateAction<string>> // ✅ add this
}

export interface Step2Props {
  host: string
  port: string
  username: string
  setHost: (val: string) => void
  setPort: (val: string) => void
  setUsername: (val: string) => void
}

export interface Step3Props {
  sessionname: string
  discription: string
  setSessionname: (val: string) => void
  setDiscription: (val: string) => void
}

export interface WorkflowItem {
  id: string
  name: string
  icon: string
}

export interface SessionItem {
  id: string
  name: string
  icon: string
}

export interface NavbarLeftProps {
  isDarkMode: boolean
  onQuickConnectClick: () => void
}

export interface UserDropdownProps {
  userName: string
  userEmail: string
  onAccountSettingsClick: () => void
  isDropdownOpen: boolean
  setIsDropdownOpen: (open: boolean) => void
}

// export interface SidebarProps {
//   setIsSidebarClose: React.Dispatch<React.SetStateAction<boolean>>;
//   setIsButtonClose: React.Dispatch<React.SetStateAction<boolean>>;
//   sidebarOnRight?: boolean
// }

export interface SidebarProps {
  setIsSidebarClose: (value: boolean) => void
  setIsButtonClose: (value: boolean) => void
  sessionOnRight: boolean
  workflowOnRight: boolean
  handleDragStart: (e: React.DragEvent, component: 'session' | 'workflow') => void
  handleDragEnd: (e: React.DragEvent) => void
  side: 'left' | 'right'
}