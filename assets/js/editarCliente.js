document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'assets/php/api.php';
    const form = document.getElementById('formCliente');
    const btnGuardar = document.getElementById('btnGuardar');
    let clienteId = null;

    const checkAmpliacion = document.getElementById('hubo_ampliacion');
    const detalleAmpliacionContainer = document.getElementById('detalleAmpliacionContainer');

    const params = new URLSearchParams(window.location.search);
    clienteId = params.get('id_cliente');

    if (!clienteId) {
        alert('No se proporcionó un ID de cliente.');
        window.location.href = 'listaClientes.html';
        return;
    }

    const toggleDetalleAmpliacion = () => {
        if (checkAmpliacion.checked) {
            detalleAmpliacionContainer.classList.remove('hidden');
        } else {
            detalleAmpliacionContainer.classList.add('hidden');
            document.getElementById('detalle_ampliacion').value = ''; // Opcional: limpiar el campo al ocultar
        }
    };

    const cargarDatosCliente = async () => {
        try {
            const res = await fetch(`${API_URL}/${clienteId}`);
            if (!res.ok) throw new Error(`Error ${res.status}: No se pudo cargar la información.`);
            const data = await res.json();
            const cliente = data.data;
                    
            document.getElementById('nombre_cliente').value = cliente.nombre_cliente || '';
            document.getElementById('telefono_cliente').value = cliente.telefono_cliente || '';
            document.getElementById('ubi_sist').value = cliente.ubi_sist || '';
            document.getElementById('capa_sist').value = cliente.capa_sist || '';
            document.getElementById('num_paneles').value = cliente.num_paneles || '';
            document.getElementById('tipo_techo').value = cliente.tipo_techo || '';
            document.getElementById('tipo_inversor').value = cliente.tipo_inversor || '';
            document.getElementById('capa_inversor').value = cliente.capa_inversor || '';
            document.getElementById('tarifa_cfe').value = cliente.tarifa_cfe || '';
            document.getElementById('fecha_compra').value = cliente.fecha_compra || '';
            document.getElementById('ulti_mantenimiento').value = cliente.ulti_mantenimiento || '';
            document.getElementById('detalle_ampliacion').value = cliente.detalle_ampliacion || '';
            document.getElementById('hilos_electricos').value = cliente.hilos_electricos || '';
            document.getElementById('hilos_fotovoltaicos').value = cliente.hilos_fotovoltaicos || '';
            document.getElementById('anios_instalacion').value = cliente.anios_instalacion || '';

            document.getElementById('estruc_metal').checked = cliente.estruc_metal == 1;
            checkAmpliacion.checked = cliente.hubo_ampliacion == 1;

            toggleDetalleAmpliacion();

        } catch (err) {
            console.error(err);
            alert('Error: ' + err.message);
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnGuardar.disabled = true;
        btnGuardar.textContent = 'Guardando...';

        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        payload.estruc_metal = document.getElementById('estruc_metal').checked ? 1 : 0;
        payload.hubo_ampliacion = checkAmpliacion.checked ? 1 : 0;

        try {
            const res = await fetch(`${API_URL}/${clienteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `HTTP ${res.status}`);
            }
                        
            alert('¡Cliente actualizado correctamente!');
            window.location.href = 'listaClientes.html';

        } catch (err) {
            console.error(err);
            alert('No se pudo actualizar el cliente: ' + err.message);
        } finally {
            btnGuardar.disabled = false;
            btnGuardar.textContent = '💾 Guardar Cambios';
        }
    });      
    checkAmpliacion.addEventListener('change', toggleDetalleAmpliacion);
    cargarDatosCliente();
});