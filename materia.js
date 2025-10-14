let materias = JSON.parse(localStorage.getItem('materiasCompletas')) || [];
let editandoIndex = -1;

// SALVAR NO LOCALSTORAGE
function salvarMaterias() {
    localStorage.setItem('materiasCompletas', JSON.stringify(materias));
}

// UTILIDADES
function getInitials(nome) {
    if (!nome) return "?";
    const palavras = nome.trim().split(/\s+/);
    return palavras.length === 1 ? palavras[0].substring(0,2).toUpperCase() : (palavras[0][0]+palavras[1][0]).toUpperCase();
}

// RENDER GRID PRINCIPAL (CARDS MATÉRIAS)
function renderMaterias(filtro = "") {
    const grid = document.getElementById('materiasGrid');
    grid.innerHTML = "";
    const filtradas = materias.filter(m => m.nome.toLowerCase().includes(filtro.toLowerCase()));

    if(filtradas.length === 0) {
        grid.innerHTML = `<div class="empty-state">
            <i class="fa-solid fa-book-open"></i>
            <p>${filtro ? 'Nenhuma matéria encontrada' : 'Nenhuma matéria cadastrada ainda'}</p>
            <p>Clique em "Adicionar Matéria" para começar</p>
        </div>`;
        return;
    }

    filtradas.forEach((m, i) => {
        const indexReal = materias.indexOf(m);
        const initials = getInitials(m.nome);
        const diasHtml = m.dias && m.dias.length > 0
            ? m.dias.map(d => `<span class="dia-badge">${d}</span>`).join('')
            : '<span style="opacity:0.5;font-size:12px;">Sem dias</span>';

        const div = document.createElement('div');
        div.className = 'materia-card';
        div.innerHTML = `
            <div class="materia-header">
                <div class="materia-icon">${initials}</div>
                <div style="flex:1">
                    <div class="materia-nome">${m.nome}</div>
                    ${m.professor ? `<div class="materia-info"><i class="fa-solid fa-user"></i> ${m.professor}</div>` : ''}
                </div>
            </div>
            ${m.email ? `<div class="materia-info"><i class="fa-solid fa-envelope"></i> ${m.email}</div>` : ''}
            ${m.telefone ? `<div class="materia-info"><i class="fa-solid fa-phone"></i> ${m.telefone}</div>` : ''}
            <div class="dias-aula">${diasHtml}</div>
        `;
        div.onclick = () => editarMateria(indexReal);
        grid.appendChild(div);
    });
}

// MODAL
function abrirModal(titulo='Adicionar Matéria') {
    document.getElementById('modalTitle').textContent = titulo;
    document.getElementById('modal').classList.add('show');
}

function fecharModal() {
    document.getElementById('modal').classList.remove('show');
    document.getElementById('materiaForm').reset();
    document.querySelectorAll('input[name="dias"]').forEach(cb => cb.checked = false);
    editandoIndex = -1;
    document.getElementById('editIndex').value = '';
    document.getElementById('btnDelete').style.display = 'none';
}

// EDITAR
function editarMateria(index) {
    editandoIndex = index;
    const m = materias[index];

    document.getElementById('inputNome').value = m.nome || '';
    document.getElementById('inputProfessor').value = m.professor || '';
    document.getElementById('inputEmail').value = m.email || '';
    document.getElementById('inputTelefone').value = m.telefone || '';
    document.getElementById('editIndex').value = index;

    document.querySelectorAll('input[name="dias"]').forEach(cb => {
        cb.checked = m.dias && m.dias.includes(cb.value);
    });

    document.getElementById('btnDelete').style.display = 'block';
    abrirModal('Editar Matéria');
}

// EXCLUIR
function excluirMateria() {
    const index = parseInt(document.getElementById('editIndex').value);
    if(confirm(`Deseja realmente excluir "${materias[index].nome}"?`)) {
        materias.splice(index,1);
        salvarMaterias();
        fecharModal();
        renderMaterias(document.getElementById('search').value);
    }
}

// TOGGLE TEMA
function toggleTheme() {
    const html = document.documentElement;
    const temaAtual = html.getAttribute('data-theme');
    const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', novoTema);
    localStorage.setItem('theme', novoTema);
    const icon = document.querySelector('.theme-toggle i');
    icon.className = novoTema === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// EVENTOS
document.getElementById('btnAddMateria').addEventListener('click', () => abrirModal('Adicionar Matéria'));

document.getElementById('materiaForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const diasSelecionados = Array.from(document.querySelectorAll('input[name="dias"]:checked')).map(cb=>cb.value);

    const materia = {
        nome: document.getElementById('inputNome').value.trim(),
        professor: document.getElementById('inputProfessor').value.trim(),
        email: document.getElementById('inputEmail').value.trim(),
        telefone: document.getElementById('inputTelefone').value.trim(),
        dias: diasSelecionados
    };

    if(editandoIndex >=0){
        materias[editandoIndex] = materia;
    } else {
        materias.push(materia);
    }

    salvarMaterias();
    fecharModal();
    renderMaterias(document.getElementById('search').value);
});

// BUSCA
document.getElementById('search').addEventListener('input', (e) => renderMaterias(e.target.value.trim()));

// FECHAR MODAL AO CLICAR NO FUNDO
document.getElementById('modal').addEventListener('click', (e)=>{
    if(e.target.id === 'modal') fecharModal();
});

// CARREGA TEMA SALVO
const temaSalvo = localStorage.getItem('theme');
if(temaSalvo){
    document.documentElement.setAttribute('data-theme', temaSalvo);
    const icon = document.querySelector('.theme-toggle i');
    icon.className = temaSalvo === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// PRIMEIRA RENDERIZAÇÃO
renderMaterias();
