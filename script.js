let contentArr = [
    {id:1, name: 'Books', content: 'Do smth', date: "2022-09-23", dateUpdated: "", category: 'Task', dateCreated:"September 21, 2022"},
    {id:2, name: 'Smth', content: 'Do smth', date: "2022-09-24", dateUpdated: "2022-09-25", category: 'Task', dateCreated:"September 21, 2022"},
    {id:3, name: 'Chair', content: 'Do smth', date: "2022-09-24", dateUpdated: "", category: 'Idea', dateCreated:"September 21, 2022"},
    {id:4, name: 'Chair', content: 'Do smth', date: "2022-09-24", dateUpdated: "", category: 'Idea', dateCreated:"September 21, 2022"}
] 
let archiveArr = [
    {id:5, name: 'Chair', content: 'Do smth', date: "2022-09-24", dateUpdated: "", category: 'Task', dateCreated:"September 21, 2022"},
    {id:6, name: 'Books', content: 'Do smth', date: "2022-09-23", dateUpdated: "", category: 'Task', dateCreated:"September 21, 2022"},
    {id:7, name: 'Books', content: 'Do smth', date: "2022-09-23", dateUpdated: "", category: 'Idea', dateCreated:"September 21, 2022"}
] 
let int = {
    idToEdit: 0,
    archive: {},
    active: {},
    error: ''
}

let openFormBtn = document.querySelector('.glow-button'),
    form = document.querySelector('.add-form'),
    cancelFormBtn = document.querySelector('.cancel-form-btn'),
    addFormBtn = document.querySelector('.add-form-btn'),
    nameInput = document.getElementById('name'),
    contentInput = document.getElementById('content'),
    dateInput = document.getElementById('date'),
    dateUpdatedInput = document.getElementById('updatedDate') 
    selectInput = document.getElementById('select'),
    wrapper = document.getElementById('wrapper'),
    archive = document.querySelector('.archive-content'),
    itemWrapper = document.querySelector('.item-wrapper'),
    closeItemBtn = document.querySelector('.close-item-btn'),
    errorDiv = document.querySelector('.error-div')
    
openFormBtn.onclick = function() {
    form.classList.add('show')
    addFormBtn.innerHTML = 'ADD'
    dateUpdatedInput.classList.remove('show')
    dateInput.classList.remove('hide')
}

cancelFormBtn.onclick = function(e) {
    e.preventDefault()
    form.classList.remove('show')
}

addFormBtn.onclick = function(e) {
    e.preventDefault()

        if(addFormBtn.innerHTML == 'ADD') {
            let id =  Math.floor(Math.random()*(1000 - 1 + 1)) + 1
            let dateCreated = new Date().toLocaleString('eng', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            })

            let model = {
                id,
                name: nameInput.value,
                content: contentInput.value,
                date: dateInput.value,
                dateUpdated: "",
                category: selectInput.value,
                dateCreated
            }
            if(model.name !== "" || model.content !== "" || model.date !== "") {
               try {
                let regexp = model.name.replace(/[^a-z0-9]/gi,'')
                model.name = regexp
                contentArr.push(model)
               } catch (e) {
                showError(e)
               }
            } else {
                showError('Name, content and date cant be empty!')
            }
        } else {
            contentArr.forEach((item, i) => {
                if(item.id == int.idToEdit) {
                    contentArr[i] = {
                        id: item.id, 
                        name: nameInput.value, 
                        content: contentInput.value,
                        date: item.date,
                        dateUpdated: dateUpdatedInput.value,
                        category: selectInput.value,
                        dateCreated: item.dateCreated
                    }
                }
            })

        }
    nameInput.value = ''
    contentInput.value = ''
    dateInput.value = ''
    form.classList.remove('show')
    getList()
}

function showError(error) {
    int.error = error
    errorDiv.classList.add('showFlex')
    errorDiv.innerHTML = `${int.error}`
    setTimeout(()=>{
        int.error = ''
        errorDiv.classList.remove('showFlex')
        },3000)
} 

function editPost(element) {
    let elementInArray = contentArr.map(item=>item.id).indexOf(element)
    let {id, name, content, date, category} = contentArr[elementInArray]

    int.idToEdit = id
    addFormBtn.innerHTML = 'EDIT'
    dateUpdatedInput.classList.add('show')
    dateInput.classList.add('hide')
    form.classList.add('show')
    
    nameInput.value = name
    contentInput.value = content
    dateInput.value = date
    selectInput.value = category
}

function deletePost(element, arr = contentArr) {
    let elementInArray = arr.map(item=>item.id).indexOf(element)
    arr.splice(elementInArray, 1)
    getList()
}

function addToArchive(element) {
    contentArr.forEach(item => {
        if(item.id == element) {
            archiveArr = [...archiveArr, item]
        }
    })
    deletePost(element, contentArr)
    getList()
}

function returnFromArchive(element, e) {
    archiveArr.forEach(item => {
        if(item.id == element) {
            contentArr = [...contentArr, item]
            itemWrapper.removeinner
        }
    })
    deletePost(element, archiveArr)
    getList()
    openItem(e)
}

function openItem(element) {
    itemWrapper.innerHTML = '<div onClick="closeItem()" class="close-item-btn"><i class="fa fa-times" ></i></div>'
    
    if(element == Number(element)) {
        contentArr.forEach(item => {
            if(item.id == element) {
                itemWrapper.innerHTML = `
                <div onClick="closeItem()" class="close-item-btn"><i class="fa fa-times" ></i></div>
                <div class="item">
                    Created: <span>${item.dateCreated}</span>
                </div>
                <div class="item">
                    Name: <span>${item.name}</span>
                </div>
                <div class="item">
                    Category: <span>${item.category}</span>
                </div>
                <div class="item">
                    Dates: <span>${item.date + ' ' + item.dateUpdated}</span>
                </div>
                <div class="item">
                    Content: <span>${item.content}</span>
                </div>
                `
            }
        })
    } else {
        itemWrapper.innerHTML +=`<h1>${element}</h1>`
        archiveArr.forEach(item => {
            if(item.category === element) {
                itemWrapper.innerHTML += `
                <div onClick="returnFromArchive(${item.id}, '${element}')" class="item archive-item">
                <div>
                    Created: <span>${item.dateCreated}</span>
                </div>
                <div>
                    Name: <span>${item.name}</span>
                </div>
                <div><i class="fa fa-archive" aria-hidden="true"></i></div>
                </div>
                `
            } 
        })
    }
    itemWrapper.classList.add('show')
}

function closeItem() {
    itemWrapper.classList.remove('show')
}

function getList() {
    int.archive = {
        Task:0,
        Idea:0,
        'Random Thought': 0
    }
    int.active = {
        Task:0,
        Idea:0,
        'Random Thought': 0
    }

    wrapper.innerHTML = ''
    
    if(contentArr.length == 0) {
        wrapper.innerHTML = 'No tasks'
    }
    contentArr.forEach(item=> {
        int.active[item.category] = int.active[item.category] + 1
       
        wrapper.innerHTML += `
        <div class="content">
            <div class="content-div" onClick="openItem(${item.id})">
                <div>${item.name.length >= 13 ? item.name.substring(0, 12) + "..." : item.name}</div>
                <div>${item.dateCreated}</div>
                <div>${item.category}</div>
                <div>${item.content.length >= 13 ? item.content.substring(0, 12) + "..." : item.content}</div>
                <div>${item.date + ' ' + item.dateUpdated}</div>
            </div>
            <div class="btns-div btns-div-absolute">
                <i onClick="addToArchive(${item.id})" class="fa fa-archive"></i>
                <i onClick="editPost(${item.id})" class="fa fa-pencil"></i>
                <i onClick="deletePost(${item.id})" class="fa fa-trash-o"></i>
            </div>
        </div>
        
        `
    })

    archive.innerHTML = ''
    
    if(archiveArr.length == 0) {
        archive.innerHTML = 'No tasks'
    } 

    archiveArr.forEach((item) => {
        int.archive[item.category] = int.archive[item.category] + 1
    })

    let keys = Object.keys(int.archive)
    let activeCount = Object.values(int.active)
    let archiveCount = Object.values(int.archive)

    for(let i = 0; i < keys.length; i++){
        if(archiveCount[i] !== 0) {
            archive.innerHTML += `
            <div onClick="openItem('${keys[i]}')" class="archive-wrapper">
                <div>${keys[i]}</div>
                <div>${activeCount[i]}</div>
                <div>${archiveCount[i]}</div>
            </div>
            ` 
        } 
    }
}
getList()