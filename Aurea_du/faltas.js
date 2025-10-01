document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("faltas-grid");
  const btnAdd = document.getElementById("btnAddMateria");

  // dados iniciais (salva em localStorage se não tiver)
  let materias = JSON.parse(localStorage.getItem("materias")) || [
    { nome: "Laboratorio de Hardware", total: 60, faltas: 10 },
    { nome: "Engenharia de softwares", total: 60, faltas: 12 },
    { nome: "Linguagem de programação", total: 60, faltas: 30 },
    { nome: "Contabilidade", total: 40, faltas: 8 },
    { nome: "Sistemas Operacionais", total: 60, faltas: 6 },
    { nome: "Programação de scripts", total: 50, faltas: 5 },
  ];

  function salvarMaterias() {
    localStorage.setItem("materias", JSON.stringify(materias));
  }

  function calcularPresenca(total, faltas) {
    total = Number(total) || 0;
    faltas = Number(faltas) || 0;
    if (total <= 0) return 0;
    return ((total - faltas) / total) * 100;
  }

  function getColorClass(presenca) {
    if (presenca >= 75) return "cor-alta";
    if (presenca >= 50) return "cor-media";
    return "cor-baixa";
  }

  function getInitials(name) {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
    return (parts[0][0] + (parts[1][0] || "")).toUpperCase();
  }

  function renderMaterias(filter = "") {
    grid.innerHTML = "";
    materias.forEach((m, i) => {
      if (filter && !m.nome.toLowerCase().includes(filter.toLowerCase())) return;

      const presenca = calcularPresenca(m.total, m.faltas);
      const colorClass = getColorClass(presenca);
      const initials = getInitials(m.nome);

      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4";

      col.innerHTML = `
        <div class="materia-card">
          <div class="materia-icon ${colorClass}" aria-hidden="true">${initials}</div>
          <div class="materia-info">
            <div class="d-flex w-100 justify-content-between align-items-start">
              <div>
                <div class="materia-nome">${m.nome}</div>
                <div class="materia-sub">Total: ${m.total} • Faltas: ${m.faltas}</div>
              </div>
              <div class="text-end">
                <div style="font-weight:700; font-size:18px;">${presenca.toFixed(1)}%</div>
                <div style="font-size:12px; color:#666">presença</div>
              </div>
            </div>
            <div class="mt-2 card-actions">
              <button class="btn btn-sm btn-light me-1 edit-btn" data-index="${i}"><i class="fa-solid fa-pen-to-square"></i> Editar</button>
              <button class="btn btn-sm btn-outline-danger del-btn" data-index="${i}"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        </div>
      `;

      grid.appendChild(col);
    });
  }

  // handlers: abrir modal para editar
  const editModalEl = document.getElementById("editModal");
  const editModal = new bootstrap.Modal(editModalEl);
  const editForm = document.getElementById("editForm");
  const editIndex = document.getElementById("edit-index");
  const editNome = document.getElementById("edit-nome");
  const editTotal = document.getElementById("edit-total");
  const editFaltas = document.getElementById("edit-faltas");

  // abrir modal para novo
  btnAdd.addEventListener("click", () => {
    editIndex.value = "";
    editNome.value = "";
    editTotal.value = "";
    editFaltas.value = "";
    editModal.show();
  });

  // delegação: editar / deletar
  grid.addEventListener("click", (ev) => {
    const editBtn = ev.target.closest(".edit-btn");
    const delBtn = ev.target.closest(".del-btn");

    if (editBtn) {
      const i = Number(editBtn.dataset.index);
      editIndex.value = i;
      editNome.value = materias[i].nome;
      editTotal.value = materias[i].total;
      editFaltas.value = materias[i].faltas;
      editModal.show();
    } else if (delBtn) {
      const i = Number(delBtn.dataset.index);
      if (confirm(`Excluir "${materias[i].nome}"?`)) {
        materias.splice(i,1);
        salvarMaterias();
        renderMaterias(document.getElementById("search").value || "");
      }
    }
  });

  // salvar novo/editar
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const i = editIndex.value;
    const obj = {
      nome: editNome.value.trim(),
      total: Number(editTotal.value) || 0,
      faltas: Number(editFaltas.value) || 0
    };

    if (i === "") {
      materias.push(obj);
    } else {
      materias[Number(i)] = obj;
    }

    salvarMaterias();
    editModal.hide();
    renderMaterias(document.getElementById("search").value || "");
  });

  // pesquisa simples
  const search = document.getElementById("search");
  search.addEventListener("input", () => {
    renderMaterias(search.value.trim());
  });

  // primeira renderização
  renderMaterias();
});
