let items = document.getElementById('items')
fs = require('fs')
const {shell} = require('electron')


let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString()
})

window.addEventListener('message', e => {
    console.log(e.data)
    if (e.data.action === 'delete-reader-item') {
        this.deleteItem(e.data.itemIndex)
        e.source.close()
    }
})

exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

exports.addItem = (item, isNew = false) => {
    let itemNode = document.createElement('div')
    itemNode.setAttribute('class', 'read-item')
    itemNode.setAttribute('data-url', item.url)
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`
    items.appendChild(itemNode)
    itemNode.addEventListener('click', e => {
        //console.log('click')
        this.select(e)
    })
    itemNode.addEventListener('dblclick', e => {
        //console.log('dblclick')
        this.openContent()
    })
    if (document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected')
    }
    if (isNew) {
        this.storage.push(item)
        this.save()
    }
}

exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage))
}

this.storage.forEach(i => this.addItem(i, false))


exports.select = e => {
    this.getSelectedItem().node.classList.remove('selected')
    e.currentTarget.classList.add('selected')
}

exports.changeSelection = key => {
    let currentItem = this.getSelectedItem().node
    if (key === 'ArrowUp' && currentItem.previousElementSibling) {
        currentItem.classList.remove('selected')
        currentItem.previousElementSibling.classList.add('selected')
    } else if (key === 'ArrowDown' && currentItem.nextElementSibling) {
        currentItem.classList.remove('selected')
        currentItem.nextElementSibling.classList.add('selected')
    }
}

exports.openContent = () => {
    if (!this.storage.length) {
        return
    }
    let selection = this.getSelectedItem()
    let selectedItem = selection.node
    let contentURL = selectedItem.dataset.url
    //console.log('open')
    let readerWin = window.open(contentURL, '', `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
    `)

    readerWin.eval(readerJS.replace('"{{index}}"', selection.index))
}

exports.openNative = () => {
    if (!this.storage.length) {
        return
    }
    let selection = this.getSelectedItem()
    let selectedItem = selection.node
    let contentURL = selectedItem.dataset.url
    shell.openExternal(contentURL)
}

exports.getSelectedItem = () => {
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    let index = 0
    let child = currentItem
    while ((child = child.previousElementSibling) != null) index++
    return {node: currentItem, index: index}


}

exports.deleteItem = index => {
    items.removeChild(items.childNodes[index])
    this.storage.splice(index, 1)
    this.save()
    if (this.storage.length) {
        let newSelectedIndex = index === 0 ? 0 : index - 1
        document.getElementsByClassName('read-item')[newSelectedIndex].classList.add('selected')
    }
}
