const queryId = (idName) => document.getElementById(idName)
const container = document.getElementById('container')
const containerForms = document.getElementById('form-edit')
const containerAlerts = document.getElementById('container-alerts')

const getJobs = ()=>{
    fetch('https://627ab11273bad506858e46a4.mockapi.io/Aylen/jobs')
        .then(res => res.json())
        .then(data => renderCards(data))
        .catch(() => showAlert('error'))
        .finally(()=> console.log('termine de ejecutarme'))
}
getJobs()

let idGlobal = ""

const jobDetail = (id) => {
    idGlobal = id
    console.log(idGlobal) //Esto es para que checkees por consola que se guarda correctamente
    fetch(`https://627ab11273bad506858e46a4.mockapi.io/Aylen/jobs/${id}`)
        .then(res => res.json())
        .then(data => renderDetails(data))
        .catch(() => showAlert('error'))
        .finally(()=> console.log('termine de ejecutar details'))
}

const createJob = (job)=>{
    fetch('https://627ab11273bad506858e46a4.mockapi.io/Aylen/jobs', {
        method: "POST",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(job)
        })
        .then(res => !res.ok ? showAlert('error') : getJobs())
        .finally(() => console.log("termine de ejecutar el POST"))
    
}

const editJob = (job)=>{
    fetch(`https://627ab11273bad506858e46a4.mockapi.io/Aylen/jobs/${idGlobal}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(job)
    })
    .then(res => !res.ok ? showAlert('error') : showAlert('edit'))
    .finally(()=>'termine de editar')
}

const deleteJob = (id)=>{
    fetch(`https://627ab11273bad506858e46a4.mockapi.io/Aylen/jobs/${id}`, {
        method: "DELETE",
    })
    .then(res => !res.ok ? showAlert('error') : getJobs())
    .finally(() => console.log("termine de ejecutar el DELETE"))  
}
const spinner = ()=>{
    container.innerHTML = `
    <div>
        <img src="./assets/loading.gif" alt="loadingatito" width="150px">
    <div/>
    `
    containerForms.innerHTML = ''
}
const reload = ()=>{
    setTimeout(spinner, 500)
    setTimeout(getJobs, 2000)
}
const showAlert = (string)=>{
    if (string === 'error') {
        containerForms.innerHTML = ''
        container.innerHTML = `
            <div class="container-alerts" id="container-alerts">
                <div id="errorAlert" class="alert">
                    <h2>Ha ocurrido un error. Intentalo de nuevo.</h2>
                </div>
            </div>
        `
        setTimeout(getJobs, 2000)
    } else if(string === 'edit'){
        containerForms.innerHTML = ''
        container.innerHTML = `
            <div class="container-alerts" id="container-alerts">
                <div id="editAlert" class="alert">
                <h2>Se ha editado con éxito!</h2>
                </div>
            </div>
        `
        setTimeout(()=>{jobDetail(idGlobal)}, 2000)
    } else{
        containerForms.innerHTML = ''
        container.innerHTML = `
            <div class="container-alerts" id="container-alerts">
                <div id="eliminarAlert" class="alert">
                    <h2>¿Seguro que quieres eliminar? (Esta acción no se puede deshacer)</h2>
                    <button id="alertConfirm" onclick="deleteJob(idGlobal)">Confirmar</button>
                    <button id="alertCancel" onclick="renderDetails(jobGlobal)">Cancelar</button>
                </div>
            </div> 
        `
    }
}
let dataGlobal
const renderCards=(jobs)=>{
    spinner()
    dataGlobal = jobs
    setTimeout(()=>{
    container.innerHTML = `
            <div class="filter-cards">
                <form>
                    <select id="countryFilter">
                        <option selected>Country</option>
                    </select>
                    <select id="seniorityFilter">
                        <option selected>Seniority</option>
                    </select>
                    <select id="categoryFilter">
                        <option selected>Category</option>
                    </select>
                    <button id="search" onclick="filtrar()">Search</button>
                    <button id="searchClear" onclick="getJobs()">Clear</button>
                </form>
            </div>
    `
    generarDatosFilter(jobs)
    for(const job of jobs){
        const {title, description, country, category, seniority, id} = job
        container.innerHTML += `
            <div class="container-cards__card">
                <img src="./assets/${Math.ceil(Math.random()*10)}.svg" alt="imagenrandom" width="80%">
                <h2>${title}</h1>
                <div class="container-description"><p>${description}</p></div>
                <p><span id="tag1">${country}</span> <span id="tag2">${category}</span> <span id="tag3">${seniority}</span>
                </p>
                <button onclick="jobDetail(${id})">See Details</button>
            </div>
        `
    }
}, 2000)
}
const formCrear = ()=>{
    idGlobal=""
    spinner()
    setTimeout(()=>{
    container.innerHTML=`
    <div class="form--create--edit">
    <form action="">
        <label for="">Job Title</label>
        <input type="text" id="jobTitle" placeholder="Job Title">
        <label for="">Description</label>
        <textarea id="description" rows="5"></textarea>
        <label for="">TAGS</label>
        <input type="text" id="country" placeholder="country">
        <input type="text" id="category" placeholder="Category">
        <input type="text" id="seniority" placeholder="Seniority">
        <div>
            <button class="btnSubmit" id="submitCrear">Submit</button> 
            <button id="cancelarCrear" class="btnCancelar">Cancelar</button> 
        </div>  
    </form>
</div>    
    `
    queryId('cancelarCrear').addEventListener('click', ()=>{
    getJobs()
})
    queryId('submitCrear').addEventListener('click', (e)=>{
        e.preventDefault()
        validarData()
})
}, 2000)
}

queryId('home').addEventListener('click', ()=>{
    getJobs()
})
queryId('createJob').addEventListener('click', ()=>{
    formCrear()
})

let jobTitle, description, country, category, seniority
const saveData = ()=>{
    jobTitle=queryId('jobTitle').value
    description=queryId('description').value
    country=queryId('country').value
    category=queryId('category').value
    seniority=queryId('seniority').value
}

const validarData = ()=>{
    saveData()
    if(jobTitle === "" || description === "" || country === "" || category === "" || seniority === ""){
        alert('Debe completar todos los campos')
    }
    else if(idGlobal===""){
        const objetoNewJob = {
            title: jobTitle,
            description: description,
            country: country,
            category: category,
            seniority: seniority
        }
        createJob(objetoNewJob)
    }
    else{
        const objetoEditJob = {
            title: jobTitle,
            description: description,
            country: country,
            category: category,
            seniority: seniority
        }
        editJob(objetoEditJob)
    }
}
let jobGlobal
const renderDetails = (job)=>{
    jobGlobal = job
    const {title, description, country, category, seniority, id} = job
    spinner()
    setTimeout(()=>{
    container.innerHTML = `

        <div class="container-cards__details">
            <div class="div-img">
                <img src="./assets/${Math.ceil(Math.random()*10)}.svg" alt="" width="100%">
            </div>
            <div class="div-details">
                <h2>${title}</h1>
                <p><span>Description: </span>${description}</p>
                <p><span>Location: </span>${country}</p>
                <p><span>Category: </span>${category}</p>
                <p><span>Seniority: </span>${seniority}</p>
                <button class="edit" onclick="showForm()">Edit Job</button>
                <button class="delete" onclick="showAlert()">Delete Job</button>
                <button class="back" onclick="getJobs()">   <<   </button>
            </div>
        </div>
    `
}, 2000)
}
const showForm = ()=>{  
    const {title, description, country, category, seniority} = jobGlobal
    containerForms.innerHTML = `
    <div class="form--create--edit">
        <form action="">
            <label for="">Job Title</label>
            <input type="text" id="jobTitle" value="${title}">
            <label for="">Description</label>
            <textarea id="description" rows="5">${description}</textarea>
            <label for="">TAGS</label>
            <input type="text" id="country" value="${country}">
            <input type="text" id="category" value="${category}">
            <input type="text" id="seniority" value="${seniority}">

            <div>
                <button class="btnSubmit" id="submitEditar">Submit</button> 
                <button id="cancelarEditar" class="btnCancelar">Cancelar</button> 
            </div>  
        </form>
    </div>
    `
    queryId('submitEditar').addEventListener('click', ()=>{
    
    validarData()
})
}

const generarDatosFilter = (jobs)=>{
    let paises = []
    let senioritys = []
    let categorys = []
    for(const job of jobs){
        const {country, category, seniority} = job
        !paises.includes(country) && paises.push(country)
        !senioritys.includes(seniority) && senioritys.push(seniority)
        !categorys.includes(category) && categorys.push(category)      
    } for (let i = 0; i < paises.length; i++) {
            queryId("countryFilter").innerHTML += `
                
                <option>${paises[i]}</option>
                `
            }
        for (let x = 0; x < senioritys.length; x++) {
            queryId("seniorityFilter").innerHTML += `
                
                <option>${senioritys[x]}</option>
                `
            }
        for (let z = 0; z < categorys.length; z++) {
            queryId("categoryFilter").innerHTML += `
                
                <option>${categorys[z]}</option>
                `                       
            }
}

const filtrar = ()=>{
    let dataFiltrada =''
    if(queryId('countryFilter').value !== 'Country'){
        dataFiltrada = dataGlobal.filter(job=>job.country === queryId('countryFilter').value)
        if(queryId('seniorityFilter').value !== 'Seniority'){
            dataFiltrada = dataFiltrada.filter(job=>job.seniority === queryId('seniorityFilter').value)
            if(queryId('categoryFilter').value !== 'Category'){
                dataFiltrada = dataFiltrada.filter(job=>job.category === queryId('categoryFilter').value)
                renderCards(dataFiltrada)//renderizar cards con los 3 filtros
            } else{ renderCards(dataFiltrada) }//Render COUNT y SEN
        }
        else if(queryId('categoryFilter').value !== 'Category'){
            dataFiltrada = dataFiltrada.filter(job=>job.category === queryId('categoryFilter').value)
            renderCards(dataFiltrada) //render COUNT Y CAT
        } else { renderCards(dataFiltrada) }//render COUNT
    }
    else if(queryId('seniorityFilter').value !== 'Seniority'){
        dataFiltrada = dataGlobal.filter(job=>job.seniority === queryId('seniorityFilter').value)
        if(queryId('categoryFilter').value !== 'Category'){
            dataFiltrada = dataFiltrada.filter(job=>job.category === queryId('categoryFilter').value)
            renderCards(dataFiltrada) //RENDER SEN Y CAT
        } else { renderCards(dataFiltrada) }//RENDER SEN
    } 
    else if(queryId('categoryFilter').value !== 'Category'){
        dataFiltrada = dataGlobal.filter(job=>job.category === queryId('categoryFilter').value)
        renderCards(dataFiltrada) //RENDER CAT
    } 
    else{ renderCards(dataGlobal) }
}
