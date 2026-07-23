// Mostrar/ocultar detalle de ampliación
const radiosAmpliacion = document.querySelectorAll('input[name="hubo_ampliacion"]');
const detalleWrap = document.getElementById('detalleAmpliacionWrap');
radiosAmpliacion.forEach(r => r.addEventListener('change', () => {
    detalleWrap.classList.toggle('hidden', document.querySelector('input[name="hubo_ampliacion"]:checked').value !== '1');
}));

// Envío del formulario
const form = document.getElementById('clienteForm');
const submitBtn = document.getElementById('submitBtn');
const alertBox = document.getElementById('alert');

function showAlert(type, msg) {
    alertBox.className = '';
    alertBox.classList.add('mb-4', 'p-3', 'rounded-xl');
    if (type === 'ok') {
        alertBox.classList.add('ok');
    } else {
        alertBox.classList.add('error');
    }
    alertBox.textContent = msg;
    alertBox.classList.remove('hidden');
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toJSON(formData) {
    const data = Object.fromEntries(formData.entries());
        ['capa_sist', 'num_paneles', 'capa_inversor', 'hilos_electricos', 'hilos_fotovoltaicos', 'anios_instalacion']
            .forEach(k => { if (data[k] !== undefined && data[k] !== '') data[k] = Number(data[k]); });
            
    return {
        nombre_cliente: data.nombre_cliente,
        telefono_cliente: data.telefono_cliente,
        ubi_sist: data.ubi_sist,
        capa_sist: data.capa_sist,
        num_paneles: data.num_paneles,
        tipo_techo: data.tipo_techo,
        estruc_metal: data.estruc_metal === '1' ? 1 : 0,
        tipo_inversor: data.tipo_inversor,
        capa_inversor: data.capa_inversor,
        tarifa_cfe: data.tarifa_cfe,
        hilos_electricos: data.hilos_electricos,
        hilos_fotovoltaicos: data.hilos_fotovoltaicos,
        fecha_compra: data.fecha_compra || null,
        anios_instalacion: data.anios_instalacion,
        ulti_mantenimiento: data.ulti_mantenimiento,
        hubo_ampliacion: data.hubo_ampliacion === '1' ? 1 : 0,
        detalle_ampliacion: data.detalle_ampliacion || null,
    };
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    submitBtn.disabled = true; submitBtn.textContent = 'Guardando…';
    alertBox.classList.add('hidden');

    const payload = toJSON(new FormData(form));

    const API_NEW = document.getElementById('api-new').value; 
    const url = API_NEW;
    const method = 'POST';

    try {
        const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

        if (res.ok) {
            showAlert('ok', 'Información guardada correctamente.');
            form.reset();
            detalleWrap.classList.add('hidden');
        } else {
            const errorText = await res.text();
            throw new Error('Error ' + res.status + ': ' + errorText);
        }

    } catch (err) {
        showAlert('error', 'No se pudo guardar: ' + (err.message || err));
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Guardar';
    }
});

// Atajo Ctrl+S para enviar
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        form.requestSubmit();
    }
});