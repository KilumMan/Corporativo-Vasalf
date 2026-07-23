document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const alertDiv = document.getElementById('alert');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const adminPassword = document.getElementById('adminPassword').value; // <--- Agrega este campo

        if (password !== confirmPassword) {
            showAlert('Las contraseñas no coinciden.');
            return;
        }

        // <--- Modifica el objeto para incluir la contraseña de administrador
        const userData = { name, username, password, adminPassword }; 

        try {
            const response = await fetch('assets/php/registro.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (result.success) {
                // Si el registro es exitoso, redirigimos al login
                window.location.href = 'login.html';
            } else {
                // Mostramos el error que nos devuelve el backend
                showAlert(result.message);
            }

        } catch (error) {
            showAlert('Ocurrió un error al intentar registrar la cuenta. Inténtalo de nuevo.');
            console.error('Error:', error);
        }
    });

    function showAlert(message) {
        alertDiv.textContent = message;
        alertDiv.classList.remove('hidden');
    }
});