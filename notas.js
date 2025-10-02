document.addEventListener("DOMContentLoaded", () => {
  const notasList = document.getElementById("notas-list");
  const trabalhosList = document.getElementById("trabalhos-list");
  const resumoDia = document.getElementById("resumo-dia");

  // Recuperar dados do localStorage
  let notas = JSON.parse(localStorage.getItem("notas")) || [];
  let trabalhos = JSON.parse(localStorage.getItem("trabalhos")) || [];

  function salvar() {
    localStorage.setItem("notas", JSON.stringify(notas));
    localStorage.setItem("trabalhos", JSON.stringify(trabalhos));
  }

  // Renderizar Notas
  function renderNotas() {
    notasList.innerHTML = "";
    notas.forEach((n, i) => {
      const card = document.createElement("div");
      card.className = "nota-card";
      card.innerHTML = `
        <div class="nota-header icone-roxo">${n.materia}</div>
        <div class="nota-item">Prova 1: ${n.prova1 || "--"}</div>
        <div class="nota-item">Prova 2: ${n.prova2 || "--"}</div>
        <div class="nota-item">Trabalho: ${n.trabalho || "--"}</div>
        <div class="mt-2 d-flex gap-2">
          <button class="btn btn-sm btn-light" data-index="${i}" data-type="nota" data-action="edit">✏️ Editar</button>
          <button class="btn btn-sm btn-danger" data-index="${i}" data-type="nota" data-action="delete">🗑 Excluir</button>
        </div>
      `;
      notasList.appendChild(card);
    });
  }

  // Renderizar Trabalhos
  function renderTrabalhos() {
    trabalhosList.innerHTML = "";
    trabalhos.forEach((t, i) => {
      const card = document.createElement("div");
      card.className = "trabalho-card";
      card.innerHTML = `
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <div class="trabalho-icone icone-azul">${t.materia.slice(0, 2).toUpperCase()}</div>
            <div>
              <div class="trabalho-nome">${t.nome}</div>
              <div class="trabalho-data">Prazo: <b>${t.data}</b></div>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-light" data-index="${i}" data-type="trabalho" data-action="edit">✏️</button>
            <button class="btn btn-sm btn-danger" data-index="${i}" data-type="trabalho" data-action="delete">🗑</button>
          </div>
        </div>
      `;
      trabalhosList.appendChild(card);
    });
  }

  // Renderizar Resumo (fixo por enquanto)
  function renderResumo() {
    const hoje = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    resumoDia.innerHTML = `
      <h3>${hoje}</h3>
      <p><i>para hoje:</i><br><b>Contabilidade</b></p>
      <hr>
      <p><i>para essa semana:</i><br>Laboratório de Hardware<br>Linguagem de Programação</p>
    `;
  }

  // === Eventos ===

  // Botão adicionar Nota
  document.getElementById("btnAddNota").addEventListener("click", () => {
    document.getElementById("nota-index").value = "";
    document.getElementById("nota-materia").value = "";
    document.getElementById("nota-prova1").value = "";
    document.getElementById("nota-prova2").value = "";
    document.getElementById("nota-trabalho").value = "";
    new bootstrap.Modal(document.getElementById("notaModal")).show();
  });

  // Botão adicionar Trabalho
  document.getElementById("btnAddTrabalho").addEventListener("click", () => {
    document.getElementById("trabalho-index").value = "";
    document.getElementById("trabalho-materia").value = "";
    document.getElementById("trabalho-nome").value = "";
    document.getElementById("trabalho-data").value = "";
    new bootstrap.Modal(document.getElementById("trabalhoModal")).show();
  });

  // Salvar Nota
  document.getElementById("notaForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const i = document.getElementById("nota-index").value;
    const obj = {
      materia: document.getElementById("nota-materia").value,
      prova1: document.getElementById("nota-prova1").value,
      prova2: document.getElementById("nota-prova2").value,
      trabalho: document.getElementById("nota-trabalho").value
    };
    if (i === "") {
      notas.push(obj);
    } else {
      notas[i] = obj;
    }
    salvar();
    bootstrap.Modal.getInstance(document.getElementById("notaModal")).hide();
    renderNotas();
  });

  // Salvar Trabalho
  document.getElementById("trabalhoForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const i = document.getElementById("trabalho-index").value;
    const obj = {
      materia: document.getElementById("trabalho-materia").value,
      nome: document.getElementById("trabalho-nome").value,
      data: document.getElementById("trabalho-data").value
    };
    if (i === "") {
      trabalhos.push(obj);
    } else {
      trabalhos[i] = obj;
    }
    salvar();
    bootstrap.Modal.getInstance(document.getElementById("trabalhoModal")).hide();
    renderTrabalhos();
  });

  // Editar / Excluir
  document.body.addEventListener("click", (e) => {
    if (e.target.dataset.index !== undefined) {
      const i = e.target.dataset.index;
      const tipo = e.target.dataset.type;
      const action = e.target.dataset.action;

      if (tipo === "nota") {
        if (action === "edit") {
          const n = notas[i];
          document.getElementById("nota-index").value = i;
          document.getElementById("nota-materia").value = n.materia;
          document.getElementById("nota-prova1").value = n.prova1;
          document.getElementById("nota-prova2").value = n.prova2;
          document.getElementById("nota-trabalho").value = n.trabalho;
          new bootstrap.Modal(document.getElementById("notaModal")).show();
        } else if (action === "delete") {
          notas.splice(i, 1);
          salvar();
          renderNotas();
        }
      } else if (tipo === "trabalho") {
        if (action === "edit") {
          const t = trabalhos[i];
          document.getElementById("trabalho-index").value = i;
          document.getElementById("trabalho-materia").value = t.materia;
          document.getElementById("trabalho-nome").value = t.nome;
          document.getElementById("trabalho-data").value = t.data;
          new bootstrap.Modal(document.getElementById("trabalhoModal")).show();
        } else if (action === "delete") {
          trabalhos.splice(i, 1);
          salvar();
          renderTrabalhos();
        }
      }
    }
  });

  // Primeira renderização
  renderNotas();
  renderTrabalhos();
  renderResumo();
});
