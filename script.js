// Pegando os elementos e colocando em variáveis 
const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearBtn = document.getElementById('clear')
const filter = document.querySelector('.filter')
let isEditMode = false
const formBtn = itemForm.querySelector('button')

// Função para pegar item do banco de dados local
function getItemsFromStorage() {
    let itemsFromStorage
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = []
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemsFromStorage
}

// Função para mostrar os itens provenientes do banco de dados
function displayItems() {
    const itemsFromStorage = getItemsFromStorage()
    itemsFromStorage.forEach(item => addItemtoDOM(item))
    checkUI()
}

// Função para adicionar um novo item no DOM e no banco de dados
function onAddItemSubmit(e) {
    e.preventDefault();
    let newItem = itemInput.value.trim();

    if (newItem === '') {
        alert('Please add an item')
        return
    }

    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode')
        removeItemFromStorage(itemToEdit.textContent)
        itemToEdit.classList.remove('edit-mode')
        itemToEdit.remove() 
        isEditMode = false
    } else{
        if(checkIfItemExist(newItem)){
            alert('That item already exists!')
            return
        }
    }
    
    addItemToStorage(newItem)
    addItemtoDOM(newItem)
    checkUI()
    itemInput.value = ''
}

function addItemtoDOM(item) {
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item))
    li.appendChild(createButton("remove-item btn-link text-red"))
    itemList.appendChild(li)
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage()
    itemsFromStorage.push(item)
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function createButton(classes) {
    const button = document.createElement('button')
    button.className = classes
    button.appendChild(createIcon("fa-solid fa-xmark"))
    return button
}

function createIcon(classes) {
    const icon = document.createElement('i')
    icon.className = classes
    return icon
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement)
        removeItemFromStorage(e.target.parentElement.parentElement.textContent)
    } else {
        setItemtoEdit(e.target)
    }
}

function checkIfItemExist(item){
    const itemsFromStorage = getItemsFromStorage()
    return itemsFromStorage.includes(item)
}

function setItemtoEdit(item) {
    isEditMode = true
    itemList.querySelectorAll('li').forEach(element => element.classList.remove('edit-mode'))
    item.classList.add('edit-mode')
    itemInput.value = item.textContent
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
    formBtn.style.backgroundColor = '#228B22'
    console.log(item)
}

// Funções para deletar elementos do DOM 
function removeItem(item) {
    if (confirm('Are you sure?')) {
        item.remove()  
    }
    checkUI()
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage()
    itemsFromStorage = itemsFromStorage.filter(element => element !== item.trim())
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function clearItems() {
    if(confirm('are you sure?')){
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild)
    }
    localStorage.removeItem('items')
    checkUI()
}
}

// Função para limpar interface
function checkUI() {
    itemInput.value =''
    const items = itemList.querySelectorAll('li')
    clearBtn.style.display = items.length === 0 ? 'none' : 'block'
    filter.style.display = items.length === 0 ? 'none' : 'block'
    formBtn.innerHTML= '<i class="fa-solid fa-plus"></i> Add Item'
    formBtn.style.backgroundColor = '#333'
    isEditMode = false
}

// Função para filtrar os elementos:
function filterItems(e) {
    const text = e.target.value.toLowerCase()
    const items = itemList.querySelectorAll('li')
    items.forEach(item => {
        const itemName = item.textContent.toLowerCase()
        item.style.display = itemName.includes(text) ? 'flex' : 'none'
    })
}

// Função para inicializar a aplicação
function init() {
    itemForm.addEventListener('submit', onAddItemSubmit)
    itemList.addEventListener('click', onClickItem)
    clearBtn.addEventListener('click', clearItems)
    filter.addEventListener('input', filterItems)
    document.addEventListener('DOMContentLoaded', displayItems)
}

init()
checkUI()
