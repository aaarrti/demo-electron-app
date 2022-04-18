const {ipcRenderer} = require('electron')
const items = require('./items')

let showModal = document.getElementById('show-modal')
let closeModal = document.getElementById('close-modal')
let modal = document.getElementById('modal')
let addItem = document.getElementById('add-item')
let itemUrl = document.getElementById('url')

const toggleModalButton = () => {
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
    items.addItem(newItem)
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
