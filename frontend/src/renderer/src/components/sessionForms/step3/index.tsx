import { Step3Props } from '@renderer/type'
import React from 'react'

const Step3: React.FC<Step3Props> = ({
  sessionname,
  discription,
  setSessionname,
  setDiscription
}) => (
  <div className="mt-4 mb-2">
    <h2 className="text-xs font-normal pt-0">
      This Wizard is now ready to create the new session for you
    </h2>
    <h2 className="text-xs font-medium mt-2">
      What name do you want to use to uniquely identify the new session?
    </h2>

    <div className="mt-2 pb-1">
      <label className="text-xs font-medium mb-1 flex">Session Name</label>
      <input
        type="text"
        value={sessionname}
        onChange={(e) => setSessionname(e.target.value)}
        className="w-full p-2 h-11 rounded bg-dark border border-gray-light text-white"
      />
    </div>

    <div className="mt-2 pb-1 border-box">
      <label className="text-xs font-medium mb-1 flex">Description</label>
      <textarea
        value={discription}
        onChange={(e) => setDiscription(e.target.value)}
        className="w-full p-2 h-20 rounded bg-dark border border-gray-light text-white"
      />
    </div>
  </div>
)

export default Step3
