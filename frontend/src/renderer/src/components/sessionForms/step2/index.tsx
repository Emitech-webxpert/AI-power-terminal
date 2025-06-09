import { Step2Props } from '@renderer/type'
import React from 'react'

const Step2: React.FC<Step2Props> = ({ host, port, username, setHost, setPort, setUsername }) => (
  <div className="mt-4 mb-2">
    <h2 className="text-xs font-normal pt-0">What is the name or IP Address of the remote host?</h2>
    <h2 className="text-xs font-medium mt-2">This Username can be left blank.</h2>

    <div className="mb-2">
      <label className="text-xs font-medium mb-1 flex">Host Name</label>
      <input
        type="text"
        value={host}
        onChange={(e) => setHost(e.target.value)}
        className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white"
      />
    </div>
    <div>
      <label className="text-xs font-medium mb-1 flex">Port</label>
      <input
        type="text"
        value={port}
        onChange={(e) => setPort(e.target.value)}
        className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white"
      />
    </div>

    <div className="mt-2 pb-1">
      <label className="text-xs font-medium mb-1 flex">Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white"
      />
    </div>
  </div>
)

export default Step2
