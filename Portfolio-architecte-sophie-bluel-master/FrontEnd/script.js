let works = [];
let galleryElement;

const getWorks = async () => {
    const response = await fetch("http://localhost:5678/api/works");
    const dataProjects = await response.json();
    works.push(...dataProjects);
    createWorks(works);
}
const createWorks = (works) => {
    const galleryElement = document.querySelector('.gallery');

    works.forEach(work => {
       
        const figureElement = document.createElement('figure');
        
        const imgElement = document.createElement('img');
        const figCaptionElement = document.createElement('figcaption');

        imgElement.src = work.imageUrl;
        imgElement.alt = work.title;
        
        figCaptionElement.textContent = work.title;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figCaptionElement);
        galleryElement.appendChild(figureElement);
    });
}

getWorks()


let categories = [];

const getCategories = async () => {
    const response = await fetch("http://localhost:5678/api/categories");
    const dataCategories = await response.json();
    const allCategories = [{ id: 0, name: "Tous" }, ...dataCategories];
    categories.push(...allCategories);
    createCategories(categories);
    createModalCategories(categories)
}
console.log(categories)
const createCategories = (categories) => {
    const categoriesElement = document.querySelector('.categories');

    categories.forEach(category => {

        const buttonElement = document.createElement('button');
        buttonElement.type = 'button';
        buttonElement.classList.add('button');
        
        buttonElement.textContent = category.name;
        buttonElement.id = `category-${category.id}`; 

        if (buttonElement.id === `category-${0}`){
            buttonElement.classList.add('btn_selected')
            buttonElement.setAttribute('selected', 'selected')
        }
        
        buttonElement.addEventListener('click', () => {
        applyFiltre(category, buttonElement)
        });
        
        categoriesElement.appendChild(buttonElement);
    });
}

function applyFiltre(category, buttonElement){
    const buttonSelected = document.querySelector('.btn_selected')
            
    if (buttonSelected){
    buttonSelected.classList.remove('btn_selected')
    
    }
    
    buttonElement.classList.add('btn_selected')

    const workFiltre = works.filter(function(work){

        return category.id === work.category.id || category.id === 0
    })
    document.querySelector(".gallery").innerHTML = "";
    createWorks(workFiltre);
}

getCategories()

const userConnected = () => {
    
    let token = sessionStorage.getItem('token');

    if (token) {
        const elementLogin = document.querySelector('.a_login')
        elementLogin.textContent = "logout"
        console.log('user connected')

        const elementLogout = document.querySelector('#a_logout')
        elementLogout.addEventListener('click', () => {
            sessionStorage.removeItem('token');
            window.location.href = './login.html';
        })

        const categoriesElement = document.querySelector('.categories');
        categoriesElement.style.display = 'none'

        const headerEdit = document.querySelector('#header_edit')
        headerEdit.style.display = 'flex'

    } else {
        const openModalButton = document.querySelector('.open_modal');
        openModalButton.style.display = 'none'

        const headerEdit = document.querySelector('#header_edit')
        headerEdit.style.display = 'none'

    }
}

userConnected()


const createModalCategories = (categories) => {
    const categorieModal = document.querySelector('#btn_categorie-modal2');

    categories.forEach(category => {

        const optionElement = document.createElement('option');
        optionElement.value = `${category.id}`;
        optionElement.textContent = category.name;
        optionElement.id = `${category.id}`; 

        if (category.id === 0) {
            optionElement.textContent = 'Sélectionner une catégorie';
            optionElement.setAttribute('selected', 'selected')
            }
        
        categorieModal.appendChild(optionElement);
    });
}

