document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value; // Assurez-vous que l'ID du champ est "email"
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5678/api/users/login', { // Mettez à jour avec l'URL correcte
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email, // Assurez-vous d'envoyer "email" et non "username"
                    password
                })
            });

            if (!response.ok) {
                // Si l'API renvoie une erreur, gérez-la ici
                const errorData = await response.json();
                alert('Erreur : ' + (errorData.message || 'Login incorrect'));
                return;
            }

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('authToken', data.token);
                window.location.href = './index.html'; // Redirection après connexion réussie
            } else {
                alert('Nom d\'utilisateur ou mot de passe incorrect');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
    });
});
// Fonction pour mettre à jour le lien actif en fonction de l'URL
function updateActiveLink() {
    // Récupère le chemin d'URL et l'ancre
    const currentURL = window.location.pathname;
    const currentHash = window.location.hash;

    // Supprime la classe 'active' de tous les liens
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));

    // Ajoute la classe 'active' au lien qui correspond à l'URL ou à l'ancre
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

// Appelle la fonction à chaque fois que l'utilisateur change l'ancre (clic sur un lien)
window.addEventListener('hashchange', updateActiveLink);