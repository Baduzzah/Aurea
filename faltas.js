
let materias = JSON.parse(localStorage.getItem('materias')) || [];
let editandoIndex = -1;

function salvarMaterias() {
  localStorage.setItem('materias', JSON.stringify(materias));
}

function calcularPresenca(total, faltas) {
  if (!total || total <= 0) return 0;
  return ((total - faltas) / total) * 100;
}

function getColorClass(presenca) {
  if (presenca >= 75) return 'cor-alta';
  if (presenca >= 50) return 'cor-media';
  return 'cor-baixa';
}

function getInitials(nome) {
  if (!nome) return '?';
  const palavras = nome.trim().split(/\s+/);
  if (palavras.length === 1) {
    return palavras[0].substring(0, 2).toUpperCase();
  }
  return (palavras[0][0] + palavras[1][0]).toUpperCase();
}

function renderMaterias(filtro = '') {
  const grid = document.getElementById('materiasGrid');
  const materiasFiltradas = materias.filter(m =>
    m.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  if (materiasFiltradas.length === 0) {
    grid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1;">
                        <i class="fa-solid fa-book-open"></i>
                        <p>${filtro ? 'Nenhuma matéria encontrada' : 'Nenhuma matéria cadastrada ainda'}</p>
                        <p>Clique em "Adicionar Matéria" para começar</p>
                    </div>
                `;
    return;
  }

  grid.innerHTML = materiasFiltradas.map((m, i) => {
    const indexReal = materias.indexOf(m);
    const presenca = calcularPresenca(m.total, m.faltas);
    const colorClass = getColorClass(presenca);
    const initials = getInitials(m.nome);

    return `
                    <div class="materia-card">
                        <div class="materia-header">
                            <div class="materia-icon ${colorClass}">${initials}</div>
                            <div class="materia-info">
                                <div class="materia-nome">${m.nome}</div>
                                <div class="materia-stats">
                                    ${m.total} aulas • ${m.faltas} faltas
                                </div>
                            </div>
                        </div>
                        
                        <div class="materia-presenca">
                            <span class="presenca-label">Presença</span>
                            <span class="presenca-valor ${colorClass}" style="color: var(--text);">
                                ${presenca.toFixed(1)}%
                            </span>
                        </div>

                        <div class="presenca-barra">
                            <div class="presenca-progresso ${colorClass}" 
                                 style="width: ${presenca}%"></div>
                        </div>

                        <div class="card-actions">
                            <button class="btn-edit" onclick="editarMateria(${indexReal})">
                                <i class="fa-solid fa-pen"></i> Editar
                            </button>
                            <button class="btn-delete" onclick="excluirMateria(${indexReal})">
                                <i class="fa-solid fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                `;
  }).join('');
}

function abrirModal(titulo = 'Adicionar Matéria') {
  document.getElementById('modalTitle').textContent = titulo;
  document.getElementById('modal').classList.add('show');
}

function fecharModal() {
  document.getElementById('modal').classList.remove('show');
  document.getElementById('materiaForm').reset();
  editandoIndex = -1;
}

function editarMateria(index) {
  editandoIndex = index;
  const m = materias[index];

  document.getElementById('inputNome').value = m.nome;
  document.getElementById('inputTotal').value = m.total;
  document.getElementById('inputFaltas').value = m.faltas;

  abrirModal('Editar Matéria');
}

function excluirMateria(index) {
  if (confirm(`Deseja realmente excluir "${materias[index].nome}"?`)) {
    materias.splice(index, 1);
    salvarMaterias();
    renderMaterias(document.getElementById('search').value);
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const temaAtual = html.getAttribute('data-theme');
  const novoTema = temaAtual === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', novoTema);
  localStorage.setItem('theme', novoTema);

  const icon = document.querySelector('.theme-toggle i');
  icon.className = novoTema === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

document.getElementById('btnAddMateria').addEventListener('click', () => {
  abrirModal('Adicionar Matéria');
});

document.getElementById('materiaForm').addEventListener('submit', (e) => {
  e.preventDefault();

  let total = parseInt(document.getElementById('inputTotal').value);
  let faltas = parseInt(document.getElementById('inputFaltas').value);

  // Corrige automaticamente se faltas > total
  if (faltas > total) {
    faltas = total;
    document.getElementById('inputFaltas').value = faltas; // atualiza o campo no form
  }

  const materia = {
    nome: document.getElementById('inputNome').value.trim(),
    total: total,
    faltas: faltas
  };

  if (editandoIndex >= 0) {
    materias[editandoIndex] = materia;
  } else {
    materias.push(materia);
  }

  salvarMaterias();
  fecharModal();
  renderMaterias(document.getElementById('search').value);
});


document.getElementById('search').addEventListener('input', (e) => {
  renderMaterias(e.target.value);
});

document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    fecharModal();
  }
});

const temaSalvo = localStorage.getItem('theme');
if (temaSalvo) {
  document.documentElement.setAttribute('data-theme', temaSalvo);
  const icon = document.querySelector('.theme-toggle i');
  icon.className = temaSalvo === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

renderMaterias();
