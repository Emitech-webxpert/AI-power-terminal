import { apiNodeServer } from '@renderer/constants'
import { SessionData } from '@renderer/type/sshSession'


export const createSession = async (data: SessionData) => {
  const response = await apiNodeServer.post('/sshConnection/createConnection', data)
  return response.data
}

// Get all sessions
export const getAllSessions = async () => {
  const response = await apiNodeServer.get('/sshConnection/getConnection')
  return response.data
}

// Delete session
export const deleteSession = async (id: string) => {
  const response = await apiNodeServer.delete(`/sshConnection/deleteConnection/${id}`)
  return response.data
}


