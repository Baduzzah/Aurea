document.addEventListener('DOMContentLoaded', function () {
    const el = id => document.getElementById(id);

    // ---- GRUPOS ----
    const grupEl = el('grup');
    const addBtn = el('add');
    const popGroup = el('pop');
    const novoGrupo = el('novo_grupo');
    const addNovoBtn = el('add_novo');
    const taskTable = el('task-table');

    if (grupEl && addBtn && popGroup && novoGrupo && addNovoBtn && taskTable) {
        window.displaygrupo = () => grupEl.style.display = (getComputedStyle(grupEl).display === 'none') ? 'block' : 'none';

        addBtn.addEventListener('click', () => {
            const hidden = getComputedStyle(popGroup).display === 'none';
            popGroup.style.display = hidden ? 'block' : 'none';
            addBtn.textContent = hidden ? 'fechar' : '+';
            if (hidden) novoGrupo.focus();
        });

        addNovoBtn.addEventListener('click', e => {
            e.preventDefault();
            const v = novoGrupo.value.trim();
            if (!v) { alert('Digite um nome para o grupo!'); novoGrupo.focus(); return; }
            taskTable.insertAdjacentHTML('beforeend', `<li>${v}</li>`);
            novoGrupo.value = '';
            popGroup.style.display = 'none';
            addBtn.textContent = '+';
        });
    }

    // ---- MAPAS ----
    const mapasEl = el('mapas');
    const addMapBtn = el('add-mapas');
    const popMapas = el('pop-mapas');
    const novoMapa = el('novo_mapa');
    const addNovoMapa = el('add_novo_mapa');
    const mapaTable = el('mapa-table');

    if (mapasEl && addMapBtn && popMapas && novoMapa && addNovoMapa && mapaTable) {
        window.displaymapas = () => mapasEl.style.display = (getComputedStyle(mapasEl).display === 'none') ? 'block' : 'none';

        addMapBtn.addEventListener('click', () => {
            const hidden = getComputedStyle(popMapas).display === 'none';
            popMapas.style.display = hidden ? 'block' : 'none';
            addMapBtn.textContent = hidden ? 'fechar' : '+';
            if (hidden) novoMapa.focus();
        });

        addNovoMapa.addEventListener('click', e => {
            e.preventDefault();
            const v = novoMapa.value.trim();
            if (!v) { alert('Digite um nome para o mapa mental!'); novoMapa.focus(); return; }
            mapaTable.insertAdjacentHTML('beforeend', `<li>${v}</li>`);
            novoMapa.value = '';
            popMapas.style.display = 'none';
            addMapBtn.textContent = '+';
        });
    }

    // ---- NOTIF ----
    const notifBtn = el('notif-btn');
    const notifPop = el('notif-pop');
    if (notifBtn && notifPop) {
        notifBtn.addEventListener('click', () => {
            notifPop.style.display = (getComputedStyle(notifPop).display === 'none') ? 'block' : 'none';
        });
        document.addEventListener('click', e => {
            if (!notifPop.contains(e.target) && e.target !== notifBtn) notifPop.style.display = 'none';
        });
    }

    // ---- SEÇÕES CONFIG ----
    window.showSection = id => {
        document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
        const target = el(id);
        if (target) target.style.display = 'block';
    };

    function logout() {
        if (confirm("Deseja sair da conta?")) {
            localStorage.removeItem("logado");
            localStorage.removeItem("usuario");
            window.location.href = "login.html";
        }
    }

    // ---- TEMA ----
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    atualizarTemaAtual();

    // ---- ACESSIBILIDADE ----
    const chkContraste = el('chk-contraste');
    const chkTexto = el('chk-texto');

    // inicializa a partir do localStorage
    const savedContrast = localStorage.getItem('altoContraste') === '1';
    const savedTexto = localStorage.getItem('textoMaior') === '1';

    if (chkContraste) {
        chkContraste.checked = savedContrast;
        document.body.classList.toggle('alto-contraste', savedContrast);
        chkContraste.addEventListener('change', () => {
            document.body.classList.toggle('alto-contraste', chkContraste.checked);
            localStorage.setItem('altoContraste', chkContraste.checked ? '1' : '0');
        });
    }

    if (chkTexto) {
        chkTexto.checked = savedTexto;
        document.body.classList.toggle('texto-maior', savedTexto);
        chkTexto.addEventListener('change', () => {
            document.body.classList.toggle('texto-maior', chkTexto.checked);
            localStorage.setItem('textoMaior', chkTexto.checked ? '1' : '0');
        });
    }
}); // fim DOMContentLoaded

// ---- funções globais ----
function atualizarTemaAtual() {
    const tema = document.documentElement.getAttribute('data-theme');
    const span = document.getElementById('tema-atual');
    if (span) span.textContent = (tema === 'dark') ? 'Escuro 🌙' : 'Claro ☀️';
}
function toggleTheme() {
    const html = document.documentElement;
    const novo = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', novo);
    localStorage.setItem('theme', novo);
    atualizarTemaAtual();
}
