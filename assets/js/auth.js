window.addEventListener('load', () => {
    fetch('assets/php/checkSession.php')
    .then(res => res.json())
    .then(data => {
        if (!data.loggedin) {
            window.location.href = 'login.html';
        }
    })
    .catch(err => {
        console.error('Error al verificar sesión:', err);
        window.location.href = 'login.html';
    });
});