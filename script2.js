// Get elements from document 
const itemForm = document.querySelector('#item-form') 
const itemInput = document.querySelector('#item-input')
const itemList = document.querySelector('#item-list')
const clearBtn = document.querySelector('#clear')
const filter = document.querySelector('.filter')
const formBtn = itemForm.querySelector('button')
let isEditMode = false

// Function to get element from LocalStorage
function getItemsFromStorage(){
    let itemsFromStorage
    if(localStorage.getItem('items') === null){
        itemsFromStorage =[]
    } else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }
    return itemsFromStorage

}
// Show items
function displayItems(){
    const itemsFromStorage = getItemsFromStorage()
    itemsFromStorage.forEach((element) => createElement(element))
    resetUI()
}
// Create and Edit Element From Submit
function createFromSubmit(e){
    e.preventDefault()
    const newItem = itemInput.value.toLowerCase()
    let itemsFromStorage = getItemsFromStorage()
    if( newItem == ''){
        alert('please insert a valid item')
        return
    } 
    if(itemsFromStorage.includes(newItem)){
      alert('That item already exist') 
      return 
    }
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode')
        if(itemsFromStorage.includes(itemToEdit)){
            resetUI()
            alert('That item already exist')
            return
        }
        removeItem(itemToEdit)
        itemToEdit.classList.remove('edit-mode')
        isEditMode = false
    } 

    itemsFromStorage.push(newItem)
    localStorage.setItem('items',JSON.stringify(itemsFromStorage))
    const li = document.createElement('li')
    
   createElement(newItem)
   resetUI()
}
// Create Element from Storage
function createElement(item){
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item))
    li.appendChild(createButton("remove-item btn-link text-red"))
    itemList.appendChild(li)
}
// Create Button
function createButton(classes){
    const btn = document.createElement('button')
    btn.className = classes
    btn.classList.add('remove-items')
    btn.appendChild(createIcon("fa-solid fa-xmark"))
    return btn
}
// Create icon
function createIcon(classes){
    const icon = document.createElement('i')
    icon.className = classes
    return icon
}
// Clear Interface
function resetUI(){
    itemInput.value = ''
    const items = itemList.querySelectorAll('li')
    if(items.length === 0){
        clearBtn.style.display = 'none'
        filter.style.display = 'none'
    }else{
        clearBtn.style.display = 'block'
        filter.style.display = 'block'
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add item'
    formBtn.style.backgroundColor = '#333'
    isEditMode = false
}
// Filter Items
function filterItems(e){
    let searchItem = e.target.value.toLowerCase()
    let itemList = document.querySelectorAll('li')
    for (let i=0;i<itemList.length;i++){
        if(itemList[i].innerText.indexOf(searchItem)!==-1){
        itemList[i].style.display = 'flex'
        }else{
        itemList[i].style.display = 'none'
        }
    }

}
// Options when user click on item
function onClickItem(e){
    console.log(e.target.parentElement)
    if(e.target.parentElement.classList.contains('remove-items')){
        removeItem(e.target.parentElement.parentElement)
        console.log(e.target.parentElement.parentElement)
    }else{
        setItemtoEdit(e.target)
    }
}
function setItemtoEdit(item){
    isEditMode = true
    itemList.querySelectorAll('li').forEach((i)=>i.classList.remove('edit-mode'))
    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update item'
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.innerText
}
//Remove Items
function removeItem (item){
     // Remove item from DOM
        item.remove()
     // Remove item from LocalStorage
        let itemsFromStorage = getItemsFromStorage()
     // Filter out item to be removed
        itemsFromStorage = itemsFromStorage.filter((i)=> i!==item.innerText)
     // Reset to localStorage
        localStorage.setItem('items', JSON.stringify(itemsFromStorage)) 
}
function removeAllItems(e){
    if(confirm('Are you Sure?')){
        localStorage.clear()
        itemList.querySelectorAll('li').forEach((item)=> item.remove())
        resetUI()
    }
}

// Events
function init(){
    clearBtn.addEventListener('click', removeAllItems)
    itemList.addEventListener('click',onClickItem)
    filter.addEventListener('input',filterItems)
    itemForm.addEventListener('submit', createFromSubmit)
    document.addEventListener('DOMContentLoaded', displayItems)
    document.addEventListener('click', handleClickOutside)
}

init()
resetUI()





