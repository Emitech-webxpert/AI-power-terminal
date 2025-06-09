import { spawn, ChildProcess } from 'child_process'
import { app } from 'electron'
import { join } from 'path'
import { getEnv, killPort } from '../../shared/utils'

const platformBinary = (file: string): string =>
  join(process.resourcesPath, process.platform === 'win32' ? `${file}.exe` : file)

const serviceConfigs = [
  {
    label: 'Node Server',
    port: +getEnv('NODE_SERVER_PORT'),
    path: platformBinary('server')
  },
  {
    label: 'AI Server',
    port: +getEnv('AI_SERVER_PORT'),
    path: platformBinary('ai')
  }
]

const MAX_RESTARTS = 3
const services: Record<string, ChildProcess> = {}
const restartCounts: Record<string, number> = {}
const isShuttingDown = { value: false }

const spawnService = (label: string, binPath: string): void => {
  if (isShuttingDown.value) return
  if (restartCounts[label] && restartCounts[label] >= MAX_RESTARTS) {
    console.error(`[${label}] exceeded max restart attempts`)
    return
  }

  console.log(`[${label}] launching from: ${binPath}`)
  const proc = spawn(binPath, [], { stdio: 'inherit', windowsHide: true })

  services[label] = proc
  restartCounts[label] = (restartCounts[label] || 0) + 1

  proc.on('exit', (code) => {
    console.warn(`[${label}] exited with code ${code}`)
    if (!isShuttingDown.value && restartCounts[label] < MAX_RESTARTS) {
      console.log(`[${label}] restarting (${restartCounts[label]}/${MAX_RESTARTS})`)
      spawnService(label, binPath)
    }
  })

  proc.on('error', (err) => {
    console.error(`[${label}] failed to start:`, err)
    console.error(`[${label}] binary path was: ${binPath}`)
  })
}

const stopAllServices = (): void => {
  isShuttingDown.value = true
  for (const label in services) {
    const proc = services[label]
    if (proc && !proc.killed) {
      console.log(`[${label}] stopping...`)
      proc.kill()
    }
  }
}

export const setupAllBackgroundServices = async (): Promise<void> => {
  if (!app.isPackaged) return

  for (const svc of serviceConfigs) {
    await killPort(svc.port)
    spawnService(svc.label, svc.path)
  }

  app.on('before-quit', stopAllServices)
}
