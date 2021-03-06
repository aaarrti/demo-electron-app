const {ipcRenderer} = require('electron')
const items = require('./items')

let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url'),
    search = document.getElementById('search')


search.addEventListener('keyup', e => {
    Array.from(document.getElementsByClassName('read-item'))
        .forEach(item => {
            let hasMatch = item.innerText.toLowerCase().includes(search.value.toLowerCase())
            item.style.display = hasMatch ? 'flex' : 'none'
        })
})

document.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp' || e.key === 'ArrowDown'){
        items.changeSelection(e.key)
    }
})


toggleModalButton = () => {
    if (addItem.disabled === true) {
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerText = 'Add Item'
        closeModal.style.display = 'inline'

    } else {
        addItem.disabled = true
        addItem.style.opacity = 0.5
        addItem.innerText = 'Adding...'
        closeModal.style.display = 'none'
    }
}

showModal.addEventListener('click', e => {
    modal.style.display = 'flex'
    itemUrl.focus()
})

closeModal.addEventListener('click', e => {
    modal.style.display = 'none'
})

addItem.addEventListener('click', e => {
    if (itemUrl.value) {
        console.log(itemUrl.value)
        ipcRenderer.send('new-item', itemUrl.value)
        toggleModalButton()
    }
})

ipcRenderer.on('new-item-success', (e, newItem) => {
    console.log(newItem)
    items.addItem(newItem, true)
    toggleModalButton()
    modal.style.display = 'none'
    itemUrl.value = ''
})

itemUrl.addEventListener('keyup', e => {
    //console.log(`Key pressed ${e.key}`)
    if (e.key === 'Enter') {
        addItem.click()
    }
})

ipcRenderer.on('menu-show-modal', () => {
    showModal.click()
})

ipcRenderer.on('menu-read-item', () => {
    items.openContent()
})

ipcRenderer.on('menu-delete-item', () => {
    let selected  = items.getSelectedItem()
    items.deleteItem(selected.index)
})

ipcRenderer.on('menu-open-item-native', () => {
    items.openNative()
})

ipcRenderer.on('menu-search-items', () => {
    search.focus()
})
