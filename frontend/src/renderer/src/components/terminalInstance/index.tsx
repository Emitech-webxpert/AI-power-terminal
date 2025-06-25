
import React, { useRef } from 'react'
import 'xterm/css/xterm.css'
import { useXtermInstance, useShellOutput } from '@renderer/hooks'
import type { TerminalComponentProps } from '@renderer/type/terminal'

const TerminalInstance: React.FC<TerminalComponentProps> = ({
  terminalType,
  sshParams,
  onClose,
  onTitleChange
}) => {
  const terminalRef = useRef<HTMLDivElement>(null)

  const { terminal } = useXtermInstance(terminalRef)
  
  // Updated useShellOutput call with new parameters
  useShellOutput(
    terminal,
    terminalType,
    sshParams,
    onTitleChange,
    onClose
  )

  return (
    <div
      className='w-full h-full p-3 overflow-hidden flex flex-col'
      style={{
        boxSizing: 'border-box',
      }}
    >
      <div
        className='h-full'
        ref={terminalRef}
      />
    </div>
  )
}

export default TerminalInstance