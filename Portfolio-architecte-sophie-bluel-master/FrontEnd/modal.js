
import { works } from './script.js';

const getWorks = async () => {
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
    const modal = document.getElementById('modal1');
    const mainModalGalleryElement = document.querySelector('.modal_gallery');

    
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
            const worksData = await getWorks(); 
            if (worksData && worksData.length > 0) {
                mainModalGalleryElement.innerHTML = ''; 
                createModalWorks(worksData); 
            } else {
                console.error('No works data available');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des travaux :', error);
        }
    };

    
    openModalButton.addEventListener('click', openModal);
});

const createModalWorks = (works) => {
    const mainModalGalleryElement = document.querySelector('.modal_gallery');

    works.forEach(work => {
        const figureElement = document.createElement('figure');
        const imgElement = document.createElement('img');
        const trashElement = document.createElement('span');
        const trashIcon = document.createElement('i');
        const arrowsElement = document.createElement('span');
        const arrowsIcon = document.createElement('i');

        figureElement.classList.add('modal1-figure');
        trashElement.classList.add('trash');
        trashIcon.classList.add('fa-solid', 'fa-trash-can');
        arrowsElement.classList.add('arrows');
        arrowsIcon.classList.add('fa-solid', 'fa-arrows-up-down-left-right');

        imgElement.src = work.imageUrl;
        imgElement.classList.add('modal1-img');

        trashElement.appendChild(trashIcon);
        arrowsElement.appendChild(arrowsIcon);
        figureElement.appendChild(imgElement);
        figureElement.appendChild(trashElement);
        figureElement.appendChild(arrowsElement);

        mainModalGalleryElement.appendChild(figureElement);
    });
};

