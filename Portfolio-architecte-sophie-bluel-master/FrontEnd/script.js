let works = [];

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
}

const createCategories = (categories) => {
    const categoriesElement = document.querySelector('.categories');

    categories.forEach(category => {

        const buttonElement = document.createElement('button');
        buttonElement.type = 'button';
        buttonElement.classList.add('button');
        
        buttonElement.textContent = category.name;
        buttonElement.id = `category-${category.id}`; 
        
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
    }
    )
    document.querySelector(".gallery").innerHTML = "";
    createWorks(workFiltre);
}

getCategories()