const getModalWorks = async () => {
    try {
        const response = await fetch("http://localhost:5678/api/works");
        const dataProjects = await response.json();
        console.log('Données récupérées depuis l\'API :', dataProjects);
        works.length = 0; 
        works.push(...dataProjects);
        return works; 
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return null; 
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const openModalButton = document.querySelector('.open_modal');
    const openModal2button = document.querySelector('#modal1 .modal_button-add')
    const modal = document.getElementById('modal1');
    const modal2 = document.getElementById('modal2')
    const ModalGalleryElement = document.querySelector('.modal_gallery');

    
    const openModal = async () => {
        console.log('Ouverture du modal');

        modal.classList.remove('modal_hidden');
        modal.classList.add('modal_visible');
        modal.setAttribute('aria-hidden', 'false');

        const closeModal = document.querySelector('.fa-xmark')

        closeModal.addEventListener('click', () => {
            modal.classList.add('modal_hidden');
            modal.classList.remove('modal_visible');
            modal.setAttribute('aria-hidden', 'true');
        })
        
        try {
            const worksData = await getModalWorks(); 
            if (worksData && worksData.length > 0) {
                ModalGalleryElement.innerHTML = ''; 
                createModalWorks(worksData); 
            } else {
                console.error('No works data available');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des travaux :', error);
        }
    };

    
    openModalButton.addEventListener('click', openModal);

    const openModal2 = async () => {
        console.log('Ouverture 2eme modale')

        modal2.classList.remove('modal_hidden');
        modal2.classList.add('modal_visible');
        modal2.setAttribute('aria-hidden', 'false');

        const closeModal = document.querySelector('#xmark-modal2')

        closeModal.addEventListener('click', () => {
            console.log('fermeture modale ')
            modal2.classList.add('modal_hidden');
            modal2.classList.remove('modal_visible');
            modal2.setAttribute('aria-hidden', 'true');
            modal.classList.add('modal_hidden');
            modal.classList.remove('modal_visible');
            modal.setAttribute('aria-hidden', 'true');
        })

        const closeModal2 = document.querySelector('.fa-arrow-left')

        closeModal2.addEventListener('click', () =>{
            returnModal1()
        })

    }

    openModal2button.addEventListener('click', openModal2)
});

const createModalWorks = (works) => {
    const ModalGalleryElement = document.querySelector('.modal_gallery');

    works.forEach(work => {
        const figureElement = document.createElement('figure');
        const imgElement = document.createElement('img');
        const trashElement = document.createElement('span');
        const trashIcon = document.createElement('i');
        
        figureElement.classList.add('modal1-figure');
        trashElement.classList.add('trash');
        trashIcon.classList.add('fa-solid', 'fa-trash-can');
        
        imgElement.src = work.imageUrl;
        imgElement.classList.add('modal1-img');

        trashElement.addEventListener('click', () => {
            deleteWork();
        });

        const deleteWork = async() => {
            
            let token = sessionStorage.getItem('token');
            let id = work.id;
            let figureElementTrash = trashElement.closest('figure');
            
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "*/*",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (response.status === 204) {
                figureElementTrash.remove();
                ModalGalleryElement.innerHTML = ""
                updateModal()
            }
        }

        trashElement.appendChild(trashIcon);
        figureElement.appendChild(imgElement);
        figureElement.appendChild(trashElement);
        ModalGalleryElement.appendChild(figureElement);
    });
};

const imgModal = document.querySelector('#img_modal')

imgModal.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const imageMaxSize = 4194304; 
    if (file.size <= imageMaxSize) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const btnImage = document.querySelector('.btn_photo')
            let imagePreview = document.querySelector('#imagePreview');
            if (!imagePreview) {
                imagePreview = document.createElement('img');
                imagePreview.id = 'imagePreview';
                document.querySelector('.btn_image-modal2').appendChild(imagePreview);
            }
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            btnImage.style.display = 'none'
        };
        reader.readAsDataURL(file);
    } else {
        alert("La taille de l'image est supérieur à 4Mo")
    }
});

const validModalAdd = document.querySelector('#valid')
const titleModalElement = document.querySelector('#name_modal2');
const categoryModalElement = document.querySelector('#btn_categorie-modal2')

validModalAdd.addEventListener('click', (e) => {
    e.preventDefault();
    addImg(imgModal, titleModalElement, categoryModalElement);
})

const validModalAddDisabled = () => {
    if(imgModal.value !== "" && titleModalElement.value !== "" && categoryModalElement.value !== "0"){
        validModalAdd.removeAttribute('disabled')
        validModalAdd.style.backgroundColor = '#1D6154'
    } else {
        validModalAdd.setAttribute('disabled', 'disabled')
        validModalAdd.style.backgroundColor = '#A7A7A7'
    }
}
imgModal.addEventListener('change', validModalAddDisabled);
titleModalElement.addEventListener('input', validModalAddDisabled);
categoryModalElement.addEventListener('change', validModalAddDisabled);

const addImg = async (imgModal, titleModalElement, categoryModalElement) => {
    let token = sessionStorage.getItem('token');

    const file = imgModal.files[0];
    const title = titleModalElement.value;
    const category = categoryModalElement.value;
    console.log(file, title, category)

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    const response = await fetch(`http://localhost:5678/api/works`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    if (response.status === 201) {
        await updateModal()
        returnModal1();
    }
}

const returnModal1 = () => {
    const modal = document.getElementById('modal1');
    const modal2 = document.getElementById('modal2')

    if (!modal2) return
        modal2.classList.add('modal_hidden');
        modal2.classList.remove('modal_visible');
        modal2.setAttribute('aria-hidden', 'true');
        modal.classList.add('modal_visible');
        modal.classList.remove('modal_hidden');
        modal.setAttribute('aria-hidden', 'false');
        clearForm();
}


const clearForm = () => {
    const imagePreview = document.querySelector('#imagePreview')
    if (imagePreview !== null) {
        imagePreview.remove();
        imgModal.type = "";
        imgModal.type = "file";
    }
    const btnImage = document.querySelector('.btn_photo')
    btnImage.style.display = '';
    titleModalElement.value = "";
    categoryModalElement.value = "0";
    validModalAddDisabled()
}

const updateModal = async() => {
    const galleryElement = document.querySelector('.gallery');
    
    works = []
    
    await getWorks();
    
    galleryElement.innerHTML = "";
    
    createWorks(works);
    const ModalGalleryElement = document.querySelector('.modal_gallery');
    
    ModalGalleryElement.innerHTML = "";
    createModalWorks(works);
}

