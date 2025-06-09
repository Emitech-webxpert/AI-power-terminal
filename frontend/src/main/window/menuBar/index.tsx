import { Menu, MenuItemConstructorOptions, app } from 'electron'

function createApplicationMenu(): void {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Connect',
          accelerator: 'CmdOrCtrl+Shift+C',
          click: () => {
            console.log('Connect clicked')
          }
        },
        {
          label: 'Quick connect',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            console.log('Quick connect clicked')
            // Add quick connect functionality later
          }
        },
        {
          label: 'Connect in Local Shell',
          accelerator: 'CmdOrCtrl+L',
          click: (_, browserWindow) => {
            console.log('Connect in Local Shell clicked')
            
            if (browserWindow) {
              browserWindow.webContents.executeJavaScript(`
                if (window.createLocalShell) {
                  window.createLocalShell();
                } else {
                  console.log('createLocalShell function not available yet');
                }
              `)
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Log Session',
          accelerator: 'CmdOrCtrl+Alt+L',
          click: () => {
            console.log('Log Session clicked')
            // Add session logging functionality later
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        { type: 'separator' },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectAll'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toolbar',
          type: 'checkbox',
          checked: true,
          click: (menuItem) => {
            console.log('Toolbar toggled:', menuItem.checked)
            // Add toolbar toggle functionality later
          }
        },
        {
          label: 'Menu Bar',
          type: 'checkbox',
          checked: true,
          click: (menuItem) => {
            console.log('Menu Bar toggled:', menuItem.checked)
            // Add menu bar toggle functionality later
          }
        },
        {
          label: 'Connect Bar',
          type: 'checkbox',
          checked: true,
          click: (menuItem) => {
            console.log('Connect Bar toggled:', menuItem.checked)
            // Add connect bar toggle functionality later
          }
        },
        {
          label: 'Active Session',
          type: 'checkbox',
          checked: true,
          click: (menuItem) => {
            console.log('Active Session toggled:', menuItem.checked)
            // Add active session toggle functionality later
          }
        },
        {
          label: 'Session Manager',
          type: 'checkbox',
          checked: false,
          click: (menuItem) => {
            console.log('Session Manager toggled:', menuItem.checked)
            // Add session manager toggle functionality later
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

export default createApplicationMenu