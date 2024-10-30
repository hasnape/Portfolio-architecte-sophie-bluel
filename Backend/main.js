document.addEventListener('DOMContentLoaded', () => {
    // ----- Gestion des éléments de la page -----  
    const projetsListe = document.getElementById('projets-liste');
    const modal = document.getElementById('modal');
    const projetsListeModal = document.getElementById('projets-liste-modal');
    const closeModalButton = document.querySelector('.js-modal-close');
    const addPhotoModal = document.getElementById('addPhotoModal');

    // ----- Charger et afficher les projets depuis l'API -----  
    const chargerProjets = () => {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => afficherProjets(data));
    };

    // ----- Fonction pour afficher les projets -----  
    function afficherProjets(data) {
        projetsListe.innerHTML = '';

        data.forEach(projet => {
            const projetItem = document.createElement('li');
            const image = document.createElement('img');
            image.src = projet.imageUrl;
            image.alt = projet.title;

            const titre = document.createElement('span');
            titre.textContent = projet.title;

            projetItem.appendChild(image);
            projetItem.appendChild(titre);
            projetsListe.appendChild(projetItem);
        });
    }

    // ----- Supprimer l'image via l'API -----  
    const supprimerImage = (id) => {
        fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    console.log("Image supprimée avec succès");
                    chargerProjets(); // Recharge les projets après suppression
                } else {
                    console.error("Erreur lors de la suppression de l'image");
                }
            });
    };

    // ----- Charger et afficher les filtres depuis l'API -----  
    const chargerFiltres = () => {
        fetch('http://localhost:5678/api/categories')
            .then(response => response.json())
            .then(data => {
                const filtres = ['Tous', ...data.map(item => item.name)];
                const filtresContainer = document.getElementById('filtres');

                filtres.forEach(filtre => {
                    const filtreBtn = document.createElement('button');
                    filtreBtn.textContent = filtre;
                    filtreBtn.classList.toggle('active', filtre === 'Tous');

                    filtreBtn.addEventListener('click', () => {
                        appliquerFiltre(filtre);
                        document.querySelectorAll('#filtres button').forEach(btn => btn.classList.remove('active'));
                        filtreBtn.classList.add('active');
                    });

                    filtresContainer.appendChild(filtreBtn);
                });
            });
    };

    // ----- Fonction pour appliquer un filtre -----  
    function appliquerFiltre(categorie) {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(projet => categorie === 'Tous' || projet.category.name === categorie);
                afficherProjets(filteredData);
            });
    }

    // ----- Charger les projets dans la modale ----- 
    const chargerProjetsModal = () => {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                afficherProjetsModal(data);
            });
    };

    // ----- Fonction pour afficher les projets dans la modale ----- 
    function afficherProjetsModal(data) {
        projetsListeModal.innerHTML = '';

        data.forEach(projet => {
            const projetItem = document.createElement('li');
            const image = document.createElement('img');
            image.src = projet.imageUrl;
            image.alt = projet.title;

            const titre = document.createElement('span');
            titre.textContent = projet.title;

            projetItem.appendChild(image);
            projetItem.appendChild(titre);
            projetsListeModal.appendChild(projetItem);

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = `<img class="trash" src="/FrontEnd/assets/icons/svg1.png" alt="Delete Icon">`;
            deleteButton.classList.add('delete-btn');

            // Événement pour la suppression de l'image
            deleteButton.addEventListener('click', () => {
                supprimerImage(projet.id);
                projetItem.remove(); // Retirer l'élément de la modale
            });

            projetItem.appendChild(deleteButton);
        });
    }

    // ----- Ouvrir la modale de suppression ----- 
    document.querySelector('.js-modal').addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        chargerProjetsModal(); // Charger les projets lorsque la modale s'ouvre
    });

    // ----- Fermer la modale de suppression et ouvrir la modale d'ajout de photo ----- 
    document.querySelector('.add-photo-button').addEventListener('click', () => {
        modal.style.display = 'none'; // Fermer le modal de suppression
        modal.setAttribute('aria-hidden', 'true');
        addPhotoModal.style.display = 'flex'; // Ouvrir le modal d'ajout de photo
        addPhotoModal.setAttribute('aria-hidden', 'false');
    });

    // ----- Fermer la modale ----- 
    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        projetsListeModal.innerHTML = ''; // Vider la liste des projets pour la prochaine ouverture
    });

    // ----- Fonction pour charger les catégories ----- 
    async function loadCategories() {
        const response = await fetch('http://localhost:5678/api/categories'); // Remplacez par l'URL de votre API
        const categories = await response.json();

        const categorySelect = document.getElementById('photoCategory');
        categorySelect.innerHTML = ''; // Réinitialiser les options

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id; // Assurez-vous que l'ID correspond à votre API
            option.textContent = category.name; // Assurez-vous que le nom correspond à votre API
            categorySelect.appendChild(option);
        });
    }

    // Appel de la fonction pour charger les catégories
    loadCategories();

    // ----- Gérer la soumission du formulaire d'ajout de photo ----- 
    document.getElementById('addPhotoForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Empêcher le rechargement de la page

        const formData = new FormData();
        formData.append('title', document.getElementById('photoTitle').value);
        formData.append('category', document.getElementById('photoCategory').value);
        formData.append('file', document.getElementById('photoFile').files[0]);

        const response = await fetch('http://localhost:5678/api/works', { // Remplacez par l'URL de votre API
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Photo ajoutée avec succès:', result);
            chargerProjets(); // Mettre à jour la galerie après l'ajout
            addPhotoModal.style.display = 'none'; // Fermer le modal d'ajout
        } else {
            console.error('Erreur lors de l\'ajout de la photo:', response.statusText);
        }
    });

    // Charger tous les projets et filtres par défaut  
    chargerProjets();
    chargerFiltres();
    appliquerFiltre('Tous');
});


// ----- Gérer l'aperçu de l'image téléchargée ----- 
document.getElementById('photoFile').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('photoPreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result; // Affiche l'aperçu
            preview.style.display = 'block'; // Rendre l'aperçu visible
        };
        reader.readAsDataURL(file); // Lire le fichier comme une URL de données
    } else {
        preview.src = '';
        preview.style.display = 'none'; // Masquer l'aperçu si aucun fichier n'est sélectionné
    }
});

// Sélection du bouton de fermeture de la modale d'ajout de photo
const closeAddPhotoModalButton = addPhotoModal.querySelector('.js-modal-close');

// Écouter le clic pour fermer le modal d'ajout de photo
closeAddPhotoModalButton.addEventListener('click', () => {
    addPhotoModal.style.display = 'none';
    addPhotoModal.setAttribute('aria-hidden', 'true');
});
