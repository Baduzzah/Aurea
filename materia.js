document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("faltas-grid");
  const btnAdd = document.getElementById("btnAddMateria");

  let materias = JSON.parse(localStorage.getItem("materias")) || [
    { nome: "Laboratório de Hardware", total: 60, faltas: 10 },
    { nome: "Engenharia de Software", total: 60, faltas: 12 },
    { nome: "Linguagem de Programação", total: 60, faltas: 30 },
    { nome: "Contabilidade", total: 0, faltas: 0 }, // mostra em cinza
  ];

  function salvarMaterias() {
    localStorage.setItem("materias", JSON.stringify(materias));
  }

  function calcularPresenca(total, faltas) {
    total = Number(total) || 0;
    faltas = Number(faltas) || 0;
    if (total <= 0) return null;
    return ((total - faltas) / total) * 100;
  }

  function getColorClass(presenca) {
    if (presenca === null) return "icone-cinza";
    if (presenca >= 75) return "icone-azul";
    if (presenca >= 50) return "icone-roxo";
    return "icone-rosa";
  }

  function getInitials(nome) {
    if (!nome) return "";
    const partes = nome.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }

  function renderMaterias(filter = "") {
    grid.innerHTML = "";
    materias.forEach((m, i) => {
      if (filter && !m.nome.toLowerCase().includes(filter.toLowerCase())) return;

      const presenca = calcularPresenca(m.total, m.faltas);
      const colorClass = getColorClass(presenca);
      const initials = getInitials(m.nome);
      const presencaText = presenca === null ? "—" : `${presenca.toFixed(1)}%`;

      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-4";

      col.innerHTML = `
        <div class="materia-card-novo">
          <div class="materia-icone ${colorClass}">${initials}</div>
          <div class="materia-info-novo">
            <div class="materia-nome-novo">${m.nome}</div>
            <div class="materia-presenca">${presencaText}</div>
          </div>
          <div class="materia-acoes">
            <button class="btn btn-sm btn-light me-1 edit-btn" data-index="${i}">
              <i class="fa-solid fa-pen-to-square"></i> Editar
            </button>
            <button class="btn btn-sm btn-outline-danger del-btn" data-index="${i}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
      grid.appendChild(col);
    });
  }

  // modal edição
  const editModalEl = document.getElementById("editModal");
  const editModal = new bootstrap.Modal(editModalEl);
  const editForm = document.getElementById("editForm");
  const editIndex = document.getElementById("edit-index");
  const editNome = document.getElementById("edit-nome");
  const editTotal = document.getElementById("edit-total");
  const editFaltas = document.getElementById("edit-faltas");

  btnAdd.addEventListener("click", () => {
    editIndex.value = "";
    editNome.value = "";
    editTotal.value = "";
    editFaltas.value = "";
    editModal.show();
  });

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
        materias.splice(i, 1);
        salvarMaterias();
        renderMaterias();
      }
    }
  });

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
    renderMaterias();
  });

  // pesquisa
  document.getElementById("search").addEventListener("input", (e) => {
    renderMaterias(e.target.value.trim());
  });

  renderMaterias();
});
