const queryId = (idName) => document.getElementById(idName)
const container = document.getElementById('container')
const containerForms = document.getElementById('form-edit')

const getJobs = ()=>{
    fetch('https://627ab11273bad506858e46a4.mockapi.io/Aylen/jobs')
        .then(res => res.json())
        .then(data => renderCards(data))
        .catch(err => console.log(err))
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
        .catch(err => console.log(err))
}

const createJob = (job)=>{
    fetch('https://627ab11273bad506858e46a4.mockapi.io/Aylen/jobs', {
        method: "POST",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(job)
        })
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
    .catch(err => console.log(err))
    .finally(()=>'termine de editar')
}

const deleteJob = (id)=>{
    fetch(`https://627ab11273bad506858e46a4.mockapi.io/Aylen/jobs/${id}`, {
        method: "DELETE",
    })
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
const renderCards=(jobs)=>{
    spinner()
    setTimeout(()=>{
    container.innerHTML = `
            <div class="filter-cards">
                <form>
                    <select id="countryFilter">
                        <option selected>Country</option>
                        <option value="">Arg</option>
                        <option value="">Col</option>
                        <option value="">Chile</option>
                    </select>
                    <select id="seniorityFilter">
                        <option selected>Seniority</option>
                        <option value="">Arg</option>
                        <option value="">Col</option>
                        <option value="">Chile</option>
                    </select>
                    <select id="categoryFilter">
                        <option selected>Category</option>
                        <option value="">Arg</option>
                        <option value="">Col</option>
                        <option value="">Chile</option>
                    </select>
                    <button id="search">Search</button>
                    <button id="searchClear">Clear</button>
                </form>
            </div>
    `
    for(const job of jobs){
        const {title, description, country, category, seniority, id} = job
        container.innerHTML += `
            <div class="container-cards__card">
                <img src="./assets/4.svg" alt="imagenrandom" width="80%">
                <h2>${title}</h1>
                <p>${description}</p>
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
        console.log(objetoNewJob)
        createJob(objetoNewJob)
        setTimeout(spinner, 500)
        setTimeout(getJobs, 2000)
    }
    else{
        const objetoEditJob = {
            title: jobTitle,
            description: description,
            country: country,
            category: category,
            seniority: seniority
        }
        console.log(objetoEditJob)
        editJob(objetoEditJob)
        setTimeout(spinner, 500)
        setTimeout(getJobs, 2000)
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
                <img src="./assets/1.svg" alt="" width="100%">
            </div>
            <div class="div-details">
                <h2>${title}</h1>
                <p><span>Description: </span>${description}</p>
                <p><span>Location: </span>${country}</p>
                <p><span>Category: </span>${category}</p>
                <p><span>Seniority: </span>${seniority}</p>
                <button class="edit" onclick="showForm()">Edit Job</button>
                <button class="delete" onclick="alertDeleteJob()">Delete Job</button>
            </div>
        </div>
    `
}, 2000)
}
const alertDeleteJob = ()=>{

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

