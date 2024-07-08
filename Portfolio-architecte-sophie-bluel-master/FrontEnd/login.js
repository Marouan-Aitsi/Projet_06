const formLoginElement = document.querySelector('#login');

const login = async (data) => {
    const user = {
        email: data.get('email'),
        password: data.get('password')
    };

    return await fetch('http://localhost:5678/api/users/login', {
       
        method: 'POST',
        
        headers: {
            'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(user),
    });
};

formLoginElement.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const data = new FormData(formLoginElement);
    
    try {
        const response = await login(data);
        if (!response.ok) {
            throw new Error('Erreur de connexion');
        }
        const user = await response.json();
        if (user.token) {
            sessionStorage.setItem('token', user.token);
            window.location.href = './index.html';
            console.log('user connected')
            
        } else {
            alert("Erreur dans l’identifiant ou le mot de passe");
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert("Une erreur s'est produite, vérifiez l'utilisateur ou le mot de passe");
    }
});

