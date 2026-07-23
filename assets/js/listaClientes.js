// ---------- Config ----------
const API_LIST = document.getElementById('api-list').value;      
const API_DELETE_TPL = document.getElementById('api-delete').value;
// ---------- Estado ----------
const state = {
    q: '', page: 1, pageSize: 25, sort: 'id_cliente',
    order: 'asc', total: 0, totalPages: 1,
};
// ---------- Elementos ----------
const qInput = document.getElementById('q');
const pageSizeSel = document.getElementById('pageSize');
const tbody = document.getElementById('tbody');
const summary = document.getElementById('summary');
const pageIndicator = document.getElementById('pageIndicator');
const skeleton = document.getElementById('skeleton');
const emptyBox = document.getElementById('empty');
const errorBox = document.getElementById('error');
// ---------- Utilidades ----------
const debounce = (fn, ms = 350) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

function setLoading(loading) {
    skeleton.classList.toggle('hidden', !loading);
    tbody.closest('table').classList.toggle('opacity-50', loading);
}

function renderRows(items) {
    tbody.innerHTML = '';
    const tpl = document.getElementById('rowTpl');
    items.forEach(it => {
        const tr = tpl.content.firstElementChild.cloneNode(true);
        const cells = tr.querySelectorAll('td');

        cells[0].textContent = it.id_cliente ?? '';
        cells[1].textContent = it.nombre_cliente ?? '';
        cells[2].textContent = it.telefono_cliente ?? '';
        cells[3].textContent = it.fecha_compra ?? '';
        cells[4].textContent = it.ulti_mantenimiento ?? '';

        // Acciones
        const id_cliente = it.id_cliente ?? '';
        tr.querySelector('[data-action="view"]').href = `verCliente.html?id_cliente=${encodeURIComponent(id_cliente)}`;
        tr.querySelector('[data-action="edit"]').href = `editarCliente.html?id_cliente=${encodeURIComponent(id_cliente)}`;
        tr.querySelector('[data-action="delete"]').addEventListener('click', () => onDelete(it));
        tbody.appendChild(tr);
    });
}

function renderMeta(from, to) {
    summary.textContent = state.total ? `Mostrando ${from}–${to} de ${state.total}` : '';
    pageIndicator.textContent = `Página ${state.page} de ${state.totalPages}`;
    document.getElementById('first').disabled = state.page === 1;
    document.getElementById('prev').disabled = state.page === 1;
    document.getElementById('next').disabled = state.page === state.totalPages;
    document.getElementById('last').disabled = state.page === state.totalPages;
}

// ---------- Eventos y Carga (sin cambios) ----------
document.getElementById('btnRefresh').addEventListener('click', () => load());
document.getElementById('first').addEventListener('click', () => { state.page = 1; load(); });
document.getElementById('prev').addEventListener('click', () => { if (state.page>1){ state.page--; load(); } });
document.getElementById('next').addEventListener('click', () => { if (state.page<state.totalPages){ state.page++; load(); } });
document.getElementById('last').addEventListener('click', () => { state.page = state.totalPages; load(); });
pageSizeSel.addEventListener('change', () => { state.pageSize = Number(pageSizeSel.value); state.page = 1; load(); });
qInput.addEventListener('input', debounce(() => { state.q = qInput.value.trim(); state.page = 1; load(); }, 350));
document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
        const field = th.dataset.sort;
        if (state.sort === field) { state.order = state.order === 'asc' ? 'desc' : 'asc'; }
            else { state.sort = field; state.order = 'asc'; }
        load();
    });
});

async function load() {
    setLoading(true);
    emptyBox.classList.add('hidden');
    errorBox.classList.add('hidden');
    const url = new URL(API_LIST, window.location.origin);
    url.searchParams.set('query', state.q);
    url.searchParams.set('page', String(state.page));
    url.searchParams.set('page_size', String(state.pageSize));
    url.searchParams.set('sort', state.sort);
    url.searchParams.set('order', state.order);
    try {
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            const items = Array.isArray(data.items) ? data.items : [];
            state.total = typeof data.total === 'number' ? data.total : items.length;
            state.totalPages = Math.max(1, Math.ceil(state.total / state.pageSize));
            renderRows(items);
            if (!items.length) emptyBox.classList.remove('hidden');
                const from = items.length ? ((state.page - 1) * state.pageSize) + 1 : 0;
                const to = items.length ? Math.min(state.total, state.page * state.pageSize) : 0;
                renderMeta(from, to);
    } catch (err) {
        console.error(err);
        errorBox.classList.remove('hidden');
    } finally {
        setLoading(false);
    }
}

async function onDelete(it) {
    const id = it?.id_cliente;
    if (!id) return;
    if (!confirm(`¿Eliminar al cliente "${it.nombre_cliente}"? Esta acción no se puede deshacer.`)) return;
    const url = API_DELETE_TPL.replace('{id_cliente}', encodeURIComponent(id));
        try {
            const res = await fetch(url, { method: 'DELETE' });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            load();
        } catch (err) {
            alert('No se pudo eliminar: ' + (err.message || err));
        }
}
        
load(); // Carga inicial