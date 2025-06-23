import React from 'react'
import { line } from '@renderer/assets'

const OrDivider: React.FC = () => {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex items-center justify-center rotate-180">
        <img src={line} alt="line" />
      </div>
      <span className="px-3 text-white text-sm relative">or</span>
      <div className="flex items-center justify-center">
        <img src={line} alt="line" />
      </div>
    </div>
  )
}

export default OrDivider