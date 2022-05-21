const queryId = (idName) => document.getElementById(idName)
const containerCards = document.getElementById('container-cards')
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

const userDetail = (id) => {
    idGlobal = id
    console.log(idGlobal) //Esto es para que checkees por consola que se guarda correctamente
    fetch(`https://627ab11273bad506858e46a4.mockapi.io/Aylen/jobs/${id}`)
        .then(res => res.json())
        .then(data => renderDetails(data))
        .catch(err => console.log(err))
}

const createJob = ()=>{
    fetch('https://627ab11273bad506858e46a4.mockapi.io/Aylen/jobs', {
        method: "POST",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(validarData())
        })
        .finally(() => console.log("termine de ejecutar el POST"))
    
}

const editForm = (id)=>{
    fetch(`https://627ab11273bad506858e46a4.mockapi.io/Aylen/jobs/${id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(validarData())
    })
    .catch(err => console.log(err))
    .finally(()=>'termine de editar')
}

const renderCards=(jobs)=>{
    containerCards.innerHTML = ''
    for(const job of jobs){
        const {title, description, country, category, seniority, experience, id} = job
        containerCards.innerHTML += `
            <div class="container-cards__card">
                <img src="./assets/4.svg" alt="imagenrandom" width="80%">
                <h2>${title}</h1>
                <p>${description}</p>
                <p><span id="tag1">${country}</span> <span id="tag2">${category}</span> <span id="tag3">${seniority}</span>
                </p>
                <button onclick="userDetail(${id})">See Details</button>
            </div>
        `
    }
}

const formCrear = ()=>{
    containerCards.innerHTML=''
    containerCards.innerHTML=`
    <div class="form--create--edit">
    <form action="">
        <label for="">Job Title</label>
        <input type="text" id="jobTitle" placeholder="Job Title">
        <label for="">Description</label>
        <textarea id="description" rows="5"></textarea>
        <label for="">Experience</label>
        <select aria-label="experience" id="experience">
              <option selected>Select an option</option>
              <option value="Not necesary">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
        </select>
        <label for="">TAGS</label>
        <input type="text" id="country" placeholder="country">
        <input type="text" id="category" placeholder="Category">
        <input type="text" id="seniority" placeholder="Seniority">
        <div>
            <button class="btnSubmit" type="submit" id="submitCrear">Submit</button> 
            <button id="cancelarCrear" class="btnCancelar">Cancelar</button> 
        </div>  
    </form>
</div>    
    `
    queryId('cancelarCrear').addEventListener('click', ()=>{
    getJobs()
})
    queryId('submitCrear').addEventListener('click', ()=>{
        createJob()
        getJobs()
})
}

queryId('home').addEventListener('click', ()=>{
    getJobs()
})
queryId('createJob').addEventListener('click', ()=>{
    formCrear()
})

let jobTitle, description, experience, country, category, seniority
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
    else{
        return {
            title: jobTitle,
            description: description,
            country: country,
            category: category,
            seniority: seniority,
            experience: "Number(6)",
            id: idGlobal
        }
    }
}
let jobGlobal
const renderDetails = (job)=>{
    jobGlobal = job
    console.log(jobGlobal) //Esto es para que checkees por consola que se guarda correctamente
    containerCards.innerHTML = ''
    const {title, description, country, category, seniority, experience, id} = job
    containerCards.innerHTML = `
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
                <button class="delete">Delete Job</button>
            </div>
        </div>
    `
}
const showForm = ()=>{  
    const {title, description, country, category, seniority, experience} = jobGlobal
    containerForms.innerHTML = `
    <div class="form--create--edit">
        <form action="">
            <label for="">Job Title</label>
            <input type="text" id="jobTitle" value="${title}">
            <label for="">Description</label>
            <textarea id="description" rows="5">${description}</textarea>
            <label for="">Experience</label>
            
            <label for="">TAGS</label>
            <input type="text" id="country" value="${country}">
            <input type="text" id="category" value="${category}">
            <input type="text" id="seniority" value="${seniority}">

            <div>
                <button class="btnSubmit" type="submit" id="submitEditar">Submit</button> 
                <button id="cancelarEditar" class="btnCancelar">Cancelar</button> 
            </div>  
        </form>
    </div>
    `
    queryId('submitEditar').addEventListener('click', ()=>{
    
    editForm(idGlobal)
    
})
}

