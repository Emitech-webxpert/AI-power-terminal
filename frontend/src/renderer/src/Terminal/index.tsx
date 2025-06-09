
import React from 'react'
import TerminalTabs from "@components/tab"
import type { TerminalProps } from '@renderer/type/terminal'


const Terminal: React.FC<TerminalProps> = ({className }) => {
  return (
    <TerminalTabs 
      className={className}
    />
  )
}

export default Terminal