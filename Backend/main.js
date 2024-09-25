document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            const projetsListe = document.getElementById('projets-liste');
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
        });
});

// Filtre
document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(data => {
            const filtres = ['Tous'];
            data.forEach(item => {
                filtres.push(item.name);
            });

            const filtresContainer = document.getElementById('filtres');
            filtres.forEach(filtre => {
                const filtreBtn = document.createElement('button');
                filtreBtn.textContent = filtre;

                // Ajout de l'événement pour appliquer le filtre et changer le style
                filtreBtn.addEventListener('click', () => {
                    appliquerFiltre(filtre);
                    // Retirer la classe active de tous les boutons
                    document.querySelectorAll('#filtres button').forEach(btn => btn.classList.remove('active'));
                    // Ajouter la classe active au bouton cliqué
                    filtreBtn.classList.add('active');
                });

                filtresContainer.appendChild(filtreBtn);
            });
        });

    // Fonction pour appliquer le filtre
    function appliquerFiltre(categorie) {
        fetch('http://localhost:5678/api/works')
            .then(response => response.json())
            .then(data => {
                const projetsListe = document.getElementById('projets-liste');
                projetsListe.innerHTML = '';

                data.forEach(projet => {
                    if (categorie === 'Tous' || projet.category.name === categorie) {
                        const projetItem = document.createElement('li');
                        const image = document.createElement('img');
                        image.src = projet.imageUrl;
                        image.alt = projet.title;

                        const titre = document.createElement('span');
                        titre.textContent = projet.title;

                        projetItem.appendChild(image);
                        projetItem.appendChild(titre);
                        projetsListe.appendChild(projetItem);
                    }
                });
            });
    }

    // Charger tous les projets au départ
    appliquerFiltre('Tous');
});

// Fonction pour mettre à jour le lien actif en fonction de l'URL
function updateActiveLink() {
    const currentURL = window.location.pathname;
    const currentHash = window.location.hash;

    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));

    if (currentURL.includes("/index.html") && !currentHash) {
        document.getElementById("projects-link").classList.add("active");
    } else if (currentHash === "#contact") {
        document.getElementById("contact-link").classList.add("active");
    } else if (currentURL.includes("login.html")) {
        document.getElementById("login-link").classList.add("active");
    }
}

// Appelle la fonction au chargement de la page
window.addEventListener('load', updateActiveLink);
window.addEventListener('hashchange', updateActiveLink);
