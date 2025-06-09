import { useEffect, useState } from 'react'
import { apiNodeServer, nodeServerEndpoints } from '@renderer/constants'

const useNodeHealthCheck = (): string => {
  const [status, setStatus] = useState<string>('Checking...')

  useEffect(() => {
    const fetchHealthStatus = async (): Promise<void> => {
      try {
        const { data } = await apiNodeServer.get(nodeServerEndpoints.HEALTH_CHECK)
        setStatus(`✅ Backend Server: ${data.status} `)
      } catch {
        setStatus('❌ Backend Server Unreachable')
      }
    }

    fetchHealthStatus()
  }, [])
  console.log('Node Health Check Status:', status)
  return status
}
export default useNodeHealthCheck