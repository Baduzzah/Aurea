document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("faltas-grid");
  const btnAdd = document.getElementById("btnAddMateria");

  let materias = JSON.parse(localStorage.getItem("materias")) || [
    { nome: "Laboratório de Hardware", total: 60, faltas: 10 },
    { nome: "Engenharia de Software", total: 60, faltas: 12 },
    { nome: "Linguagem de Programação", total: 60, faltas: 30 },
    { nome: "Contabilidade", total: 40, faltas: 8 }
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

      const fs = document.createElement("fieldset");
      fs.className = "materia-fieldset";

      fs.innerHTML = `
        <div class="materia-icone ${colorClass}">${initials}</div>
        <div class="materia-nome">${m.nome}</div>
      `;

      grid.appendChild(fs);
    });
  }

  // Modal edição
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

  // Busca
  document.getElementById("search").addEventListener("input", (e) => {
    renderMaterias(e.target.value.trim());
  });

  // Primeira renderização
  renderMaterias();
});
