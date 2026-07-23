document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'assets/php/api.php';
    const form = document.getElementById('formCliente');
    const params = new URLSearchParams(window.location.search);
    const clienteId = params.get('id_cliente');

    if (!clienteId) {
        alert('No se proporcionó un ID de cliente.');
        window.location.href = 'listaClientes.html';
        return;
    }

    const cargarDatosCliente = async () => {
        try {
            const res = await fetch(`${API_URL}/${clienteId}`);
            if (!res.ok) throw new Error(`Error ${res.status}: No se pudo cargar la información.`);
            const data = await res.json();
            const cliente = data.data;
                    
            // Rellenar todos los campos del formulario
            Object.keys(cliente).forEach(key => {
                const el = document.getElementById(key);
                if (el) {
                    if (el.type === 'checkbox') {
                        el.checked = cliente[key] == 1;
                    } else {
                        el.value = cliente[key] || '';
                    }
                }
            });

            // Mostrar/ocultar detalles de ampliación
            if (cliente.hubo_ampliacion == 1) {
                document.getElementById('detalleAmpliacionContainer').classList.remove('hidden');
            }

            // Desactivar todos los campos para que sean de solo lectura
            form.querySelectorAll('input, textarea').forEach(el => {
                el.disabled = true;
            });

        } catch (err) {
            console.error(err);
                alert('Error: ' + err.message);
            }
    };
    cargarDatosCliente();
});