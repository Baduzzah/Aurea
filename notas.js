document.addEventListener("DOMContentLoaded", () => {
  // ====== Dados ======
  let materias = JSON.parse(localStorage.getItem('notasMaterias')) || [];
  let editandoIndex = -1;
  let contadores = { provas: 0, trabalhos: 0, atividades: 0 };

  // ====== Funções de armazenamento ======
  function salvarMaterias() {
    localStorage.setItem('notasMaterias', JSON.stringify(materias));
    document.dispatchEvent(new Event('lembreteAtualizado')); // Atualiza painel lateral
  }

  // ====== Funções de UI: Adicionar/Remover Avaliações ======
  function adicionarItem(tipo) {
    const container = document.getElementById(`${tipo}Container`);
    const id = Date.now();
    const prefixo = tipo === 'provas' ? 'P' : tipo === 'trabalhos' ? 'T' : 'A';
    contadores[tipo]++;

    const div = document.createElement('div');
    div.className = 'item-input-group';
    div.innerHTML = `
      <input type="text" class="form-input" placeholder="Nome (ex: ${prefixo}${contadores[tipo]})" 
             data-tipo="${tipo}" data-id="${id}" data-tipo-input="nome" required>
      <input type="number" class="form-input" placeholder="Nota" step="0.1" min="0" max="10"
             data-tipo="${tipo}" data-id="${id}" data-tipo-input="nota" required>
      <button type="button" class="btn-remove" onclick="removerItem(this)">
          <i class="fa-solid fa-trash"></i>
      </button>
    `;
    container.appendChild(div);
  }

  function removerItem(btn) {
    btn.parentElement.remove();
  }

  // ====== Coletar Avaliações e calcular média ======
  function coletarAvaliacoes() {
    const avaliacoes = { provas: {}, trabalhos: {}, atividades: {} };

    ['provas', 'trabalhos', 'atividades'].forEach(tipo => {
      const inputs = document.querySelectorAll(`input[data-tipo="${tipo}"]`);
      const grupos = {};
      inputs.forEach(input => {
        const id = input.dataset.id;
        const tipoInput = input.dataset.tipoInput;
        if (!grupos[id]) grupos[id] = {};
        grupos[id][tipoInput] = input.value;
      });
      Object.values(grupos).forEach(item => {
        if (item.nome && item.nota !== undefined) {
          avaliacoes[tipo][item.nome] = parseFloat(item.nota) || 0;
        }
      });
    });

    return avaliacoes;
  }

  function calcularMedia(avaliacoes, formula) {
    try {
      let formulaProcessada = formula;
      const todasNotas = { ...avaliacoes.provas, ...avaliacoes.trabalhos, ...avaliacoes.atividades };
      Object.keys(todasNotas).forEach(nome => {
        const regex = new RegExp(`\\b${nome}\\b`, 'g');
        formulaProcessada = formulaProcessada.replace(regex, todasNotas[nome]);
      });
      const resultado = eval(formulaProcessada);
      return isNaN(resultado) ? 0 : resultado;
    } catch (e) {
      return 0;
    }
  }

  function getMediaClass(media) {
    if (media >= 7) return 'media-aprovado';
    if (media >= 5) return 'media-recuperacao';
    return 'media-reprovado';
  }

  // ====== Renderizar Matérias ======
  function renderMaterias() {
    const grid = document.getElementById('materiasGrid');
    if (materias.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; opacity: 0.6;">
          <i class="fa-solid fa-book-open" style="font-size: 64px; margin-bottom: 20px;"></i>
          <p>Nenhuma matéria cadastrada ainda</p>
        </div>`;
      return;
    }

    grid.innerHTML = materias.map((m, i) => {
      const media = calcularMedia(m.avaliacoes, m.formula);
      const mediaClass = getMediaClass(media);

      const renderSecao = (titulo, dados) => {
        if (Object.keys(dados).length === 0) return '';
        return `
          <div class="notas-section">
            <h4>${titulo}</h4>
            ${Object.entries(dados).map(([nome, nota]) => `
              <div class="nota-item">
                <span class="nota-label">${nome}</span>
                <span class="nota-valor">${nota.toFixed(1)}</span>
              </div>`).join('')}
          </div>`;
      };

      return `
        <div class="materia-card">
          <div class="materia-header">
            <span class="materia-nome">${m.nome}</span>
            <span class="materia-media ${mediaClass}">${media.toFixed(1)}</span>
          </div>
          ${renderSecao('Provas', m.avaliacoes.provas)}
          ${renderSecao('Trabalhos', m.avaliacoes.trabalhos)}
          ${renderSecao('Atividades', m.avaliacoes.atividades)}
          <div class="formula-display"><strong>Fórmula:</strong> ${m.formula}</div>
          <div class="card-actions">
            <button class="btn-edit" onclick="editarMateria(${i})"><i class="fa-solid fa-pen"></i> Editar</button>
            <button class="btn-delete" onclick="excluirMateria(${i})"><i class="fa-solid fa-trash"></i> Excluir</button>
          </div>
        </div>`;
    }).join('');
  }

  // ====== Modais ======
  function abrirModal() {
    document.getElementById('modalTitle').textContent = 'Adicionar Matéria';
    document.getElementById('modal').classList.add('show');
    limparFormulario();
  }

  function fecharModal() {
    document.getElementById('modal').classList.remove('show');
    limparFormulario();
    editandoIndex = -1;
  }

  function limparFormulario() {
    document.getElementById('materiaForm').reset();
    document.getElementById('provasContainer').innerHTML = '';
    document.getElementById('trabalhosContainer').innerHTML = '';
    document.getElementById('atividadesContainer').innerHTML = '';
    contadores = { provas: 0, trabalhos: 0, atividades: 0 };

    // Resetar toggle de fórmula
    const toggle = document.getElementById('customFormulaToggle');
    const customContainer = document.getElementById('customFormulaContainer');
    const formulaSelect = document.getElementById('formulaSelect');
    const inputFormula = document.getElementById('inputFormula');

    toggle.checked = false;
    customContainer.style.display = 'none';
    formulaSelect.style.display = 'block';
    inputFormula.required = false;
    formulaSelect.required = true;
  }

  function editarMateria(index) {
    editandoIndex = index;
    const m = materias[index];
    document.getElementById('modalTitle').textContent = 'Editar Matéria';
    document.getElementById('inputNome').value = m.nome;
    // ====== Fórmula: decide se é custom ou select ======
    const toggle = document.getElementById('customFormulaToggle');
    const customContainer = document.getElementById('customFormulaContainer');
    const formulaSelect = document.getElementById('formulaSelect');
    const inputFormula = document.getElementById('inputFormula');

    const formulasProntas = Array.from(formulaSelect.options).map(opt => opt.value);
    if (formulasProntas.includes(m.formula)) {
      toggle.checked = false;
      customContainer.style.display = 'none';
      formulaSelect.style.display = 'block';
      formulaSelect.value = m.formula;
      inputFormula.required = false;
      formulaSelect.required = true;
    } else {
      toggle.checked = true;
      customContainer.style.display = 'block';
      formulaSelect.style.display = 'none';
      inputFormula.value = m.formula;
      inputFormula.required = true;
      formulaSelect.required = false;
    }

    // ====== Avaliações ======
    limparFormulario(); // limpa containers

    Object.entries(m.avaliacoes.provas).forEach(([nome, nota]) => {
      adicionarItem('provas');
      const inputs = document.querySelectorAll('#provasContainer .item-input-group:last-child input');
      inputs[0].value = nome;
      inputs[1].value = nota;
    });
    Object.entries(m.avaliacoes.trabalhos).forEach(([nome, nota]) => {
      adicionarItem('trabalhos');
      const inputs = document.querySelectorAll('#trabalhosContainer .item-input-group:last-child input');
      inputs[0].value = nome;
      inputs[1].value = nota;
    });
    Object.entries(m.avaliacoes.atividades).forEach(([nome, nota]) => {
      adicionarItem('atividades');
      const inputs = document.querySelectorAll('#atividadesContainer .item-input-group:last-child input');
      inputs[0].value = nome;
      inputs[1].value = nota;
    });

    document.getElementById('modal').classList.add('show');
  }

  function excluirMateria(index) {
    if (confirm(`Deseja realmente excluir "${materias[index].nome}"?`)) {
      materias.splice(index, 1);
      salvarMaterias();
      renderMaterias();
    }
  }

  // ====== Painel lateral ======
  function atualizarPainelLateral() {
    const resumoEl = document.getElementById('resumo-eventos');
    if (!resumoEl) return;

    let eventos = [];

    // Eventos do calendário
    const anotacoesCalendario = JSON.parse(localStorage.getItem('anotacoesCalendario')) || {};
    Object.keys(anotacoesCalendario).forEach(dataChave => {
      anotacoesCalendario[dataChave].forEach(texto => {
        eventos.push({
          data: dataChave,
          texto: texto.replace('📌 ', ''),
          tipo: texto.startsWith('📌') ? 'Lembrete' : 'Calendário'
        });
      });
    });

    

    // Ordena e pega os 3 mais próximos
    eventos.sort((a, b) => new Date(a.data) - new Date(b.data));
    const proximos = eventos.slice(0, 5);

    resumoEl.innerHTML = proximos.length
      ? proximos.map(ev => `<li>
          <span class="event-data">${ev.data.split('-').reverse().join('/')}</span>
          <span class="event-texto">${ev.texto}</span>
        </li>`).join('')
      : '<li>Nenhum evento próximo</li>';
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

  // ====== Toggle fórmula personalizada ======
  const toggle = document.getElementById('customFormulaToggle');
  const customContainer = document.getElementById('customFormulaContainer');
  const formulaSelect = document.getElementById('formulaSelect');
  const inputFormula = document.getElementById('inputFormula');

  inputFormula.required = false;
  formulaSelect.required = true;

  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      customContainer.style.display = 'block';
      formulaSelect.style.display = 'none';
      inputFormula.required = true;
      formulaSelect.required = false;
    } else {
      customContainer.style.display = 'none';
      formulaSelect.style.display = 'block';
      inputFormula.required = false;
      formulaSelect.required = true;
    }
  });

  // ====== Eventos ======
  document.getElementById('materiaForm').addEventListener('submit', (e) => {
    e.preventDefault();
     const formulaValue = toggle.checked ? inputFormula.value.trim() : formulaSelect.value.trim();

    const materia = {
      nome: document.getElementById('inputNome').value.trim(),
      avaliacoes: coletarAvaliacoes(),
      formula: formulaValue
    };
    if (editandoIndex >= 0) materias[editandoIndex] = materia;
    else materias.push(materia);
    salvarMaterias();
    fecharModal();
    renderMaterias();
  });

  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') fecharModal();
  });

  

  const temaSalvo = localStorage.getItem('theme');
  if (temaSalvo) {
    document.documentElement.setAttribute('data-theme', temaSalvo);
    const icon = document.querySelector('.theme-toggle i');
    icon.className = temaSalvo === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  // ====== Inicialização ======
  renderMaterias();
  atualizarPainelLateral();

  // Tornar funções acessíveis globalmente
  window.abrirModal = abrirModal;
  window.fecharModal = fecharModal;
  window.adicionarItem = adicionarItem;

  window.editarMateria = editarMateria;
  window.removerItem = removerItem; 
  window.excluirMateria = excluirMateria;

});

