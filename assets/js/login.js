const form = document.getElementById('loginForm');
const alertBox = document.getElementById('alert');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = form.username.value;
    const password = form.password.value;
    try {
        const res = await fetch('assets/php/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.status === 'success') {
            window.location.href = 'listaClientes.html'; // Redirige al usuario a la página principal
        } else {
            alertBox.textContent = data.message;
            alertBox.classList.remove('hidden');
        }
    } catch (err) {
        alertBox.textContent = 'Error de conexión. Intente de nuevo.';
        alertBox.classList.remove('hidden');
    }
});