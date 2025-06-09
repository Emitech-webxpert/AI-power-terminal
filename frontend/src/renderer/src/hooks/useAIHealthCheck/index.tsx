import { useEffect, useState } from 'react'
import { apiAIServer, aiServerEndpoints } from '@renderer/constants'

const useAIHealthCheck = (): string => {
    const [status, setStatus] = useState<string>('Checking...')

    useEffect(() => {
        const fetchAIHealthStatus = async (): Promise<void> => {
            try {
                const { data } = await apiAIServer.get(aiServerEndpoints.HEALTH_CHECK)
                setStatus(`🧠 AI Server: ${data.status}`)
            } catch {
                setStatus('❌ AI Server Unreachable')
            }
        }

        fetchAIHealthStatus()
    }, [])
    console.log('AI Health Check Status:', status)
    return status
}
export default useAIHealthCheck