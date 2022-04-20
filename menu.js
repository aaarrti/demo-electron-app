const {Menu, shell} = require('electron')


module.exports = (appWin) => {

    let template = [
        {
            label: 'Items',
            submenu: [
                {
                    label: 'Add New',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        appWin.webContents.send('menu-show-modal')
                    }
                },
                {
                    label: 'Read Item',
                    accelerator: 'CmdOrCtrl+Enter',
                    click: () => {
                        appWin.webContents.send('menu-read-item')
                    }
                },
                {
                    label: 'Delete Item',
                    accelerator: 'CmdOrCtrl+Backspace',
                    click: () => {
                        appWin.webContents.send('menu-delete-item')
                    }
                },
                {
                    label: 'Open in Browser',
                    accelarator: 'CmdOrCtrl+Shift+Enter',
                    click: () => {
                        appWin.send('menu-open-item-native')
                    }
                },
                {
                    label: 'Search Items',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        appWin.webContents.send('menu-search-items')
                    }
                }
            ]
        },
        {
            role: 'editMenu'
        },
        {
            role: 'windowMenu'
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn more',
                    click: () => {
                        shell.openExternal('https://github.com/Goofy-Goof/demo-electron-app')
                    }
                }
            ]

        }
    ]
    if (process.platform === 'darwin') {
        template.unshift({
            role: 'appMenu'
        })
    }
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

}
