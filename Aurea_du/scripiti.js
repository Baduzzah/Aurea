document.addEventListener('DOMContentLoaded', function () {
    const el = id => document.getElementById(id);

    // ---- GRUPOS ----
    const grupEl = el('grup');
    const addBtn = el('add');
    const popGroup = el('pop');
    const novoGrupo = el('novo_grupo');
    const addNovoBtn = el('add_novo');
    const taskTable = el('task-table');

    let grupos = JSON.parse(localStorage.getItem("grupos")) || [];

    function criarBotao(texto, cor, onClick) {
        const btn = document.createElement('button');
        btn.textContent = texto;
        btn.style.marginLeft = "6px";
        btn.style.padding = "2px 6px";
        btn.style.borderRadius = "6px";
        btn.style.border = "none";
        btn.style.backgroundColor = cor;
        btn.style.color = "#fff";
        btn.style.cursor = "pointer";
        btn.onclick = onClick;
        return btn;
    }

    function renderGrupos() {
        if (!taskTable) return;
        taskTable.innerHTML = "";
        grupos.forEach((nome, i) => {
            const li = document.createElement("li");
            li.style.marginBottom = "8px";
            li.textContent = nome;

            const editBtn = criarBotao("✎", "#6e1fff", () => {
                const novoNome = prompt("Digite o novo nome do grupo:", nome);
                if (novoNome) {
                    grupos[i] = novoNome.trim();
                    localStorage.setItem("grupos", JSON.stringify(grupos));
                    renderGrupos();
                }
            });

            const delBtn = criarBotao("x", "#ff5252", () => {
                grupos.splice(i, 1);
                localStorage.setItem("grupos", JSON.stringify(grupos));
                renderGrupos();
            });

            li.appendChild(editBtn);
            li.appendChild(delBtn);
            taskTable.appendChild(li);
        });
    }

    if (grupEl && addBtn && popGroup && novoGrupo && addNovoBtn && taskTable) {
        window.displaygrupo = () => {
            grupEl.style.display = (getComputedStyle(grupEl).display === 'none') ? 'block' : 'none';
        };

        addBtn.addEventListener('click', () => {
            const hidden = getComputedStyle(popGroup).display === 'none';
            popGroup.style.display = hidden ? 'block' : 'none';
            addBtn.textContent = hidden ? 'fechar' : '+';
            addBtn.style.backgroundColor = hidden ? '#7e57c2' : '';
            if (hidden) novoGrupo.focus();
        });

        addNovoBtn.addEventListener('click', e => {
            e.preventDefault();
            const v = novoGrupo.value.trim();
            if (!v) { alert('Digite um nome para o grupo!'); novoGrupo.focus(); return; }
            grupos.push(v);
            localStorage.setItem("grupos", JSON.stringify(grupos));
            renderGrupos();
            novoGrupo.value = '';
            popGroup.style.display = 'none';
            addBtn.textContent = '+';
            addBtn.style.backgroundColor = '';
        });

        renderGrupos();
    }

    // ---- MAPAS ----
    const mapasEl = el('mapas');
    const addMapBtn = el('add-mapas');
    const popMapas = el('pop-mapas');
    const novoMapa = el('novo_mapa');
    const addNovoMapa = el('add_novo_mapa');
    const mapaTable = el('mapa-table');

    let mapas = JSON.parse(localStorage.getItem("mapas")) || [];

    function renderMapas() {
        if (!mapaTable) return;
        mapaTable.innerHTML = "";
        mapas.forEach((nome, i) => {
            const li = document.createElement("li");
            li.style.marginBottom = "8px";
            li.textContent = nome;

            const editBtn = criarBotao("✎", "#6e1fff", () => {
                const novoNome = prompt("Digite o novo nome do mapa mental:", nome);
                if (novoNome) {
                    mapas[i] = novoNome.trim();
                    localStorage.setItem("mapas", JSON.stringify(mapas));
                    renderMapas();
                }
            });

            const delBtn = criarBotao("x", "#ff5252", () => {
                mapas.splice(i, 1);
                localStorage.setItem("mapas", JSON.stringify(mapas));
                renderMapas();
            });

            li.appendChild(editBtn);
            li.appendChild(delBtn);
            mapaTable.appendChild(li);
        });
    }

    if (mapasEl && addMapBtn && popMapas && novoMapa && addNovoMapa && mapaTable) {
        window.displaymapas = () => mapasEl.style.display = (getComputedStyle(mapasEl).display === 'none') ? 'block' : 'none';

        addMapBtn.addEventListener('click', () => {
            const hidden = getComputedStyle(popMapas).display === 'none';
            popMapas.style.display = hidden ? 'block' : 'none';
            addMapBtn.textContent = hidden ? 'fechar' : '+';
            addMapBtn.style.backgroundColor = hidden ? '#7e57c2' : '';
            if (hidden) novoMapa.focus();
        });

        addNovoMapa.addEventListener('click', e => {
            e.preventDefault();
            const v = novoMapa.value.trim();
            if (!v) { alert('Digite um nome para o mapa mental!'); novoMapa.focus(); return; }
            mapas.push(v);
            localStorage.setItem("mapas", JSON.stringify(mapas));
            renderMapas();
            novoMapa.value = '';
            popMapas.style.display = 'none';
            addMapBtn.textContent = '+';
            addMapBtn.style.backgroundColor = '';
        });

        renderMapas();
    }

    // ---- NOTIFICAÇÕES ----
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

    // ---- LOGOUT ----
    window.logout = function () {
        if (confirm("Deseja sair da conta?")) {
            localStorage.removeItem("logado");
            localStorage.removeItem("usuario");
            window.location.href = "login.html";
        }
    };

    // ---- TEMA ----
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    atualizarTemaAtual();

    // ---- ACESSIBILIDADE ----
    const chkContraste = el('chk-contraste');
    const chkTexto = el('chk-texto');

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

    // ---- CALENDÁRIO ----
    const calendarEl = el('calendar');
    const monthYearEl = el('month-year');
    const prevBtn = el('prev-month');
    const nextBtn = el('next-month');

    const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    const days = ["D","S","T","Q","Q","S","S"];
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function renderCalendar(month, year){
        if(!calendarEl || !monthYearEl) return;
        monthYearEl.textContent = `${monthNames[month]} ${year}`;
        calendarEl.innerHTML = '';

        days.forEach(d=>{
            const headerDay=document.createElement('div');
            headerDay.textContent=d;
            calendarEl.appendChild(headerDay);
        });

        let firstDay=new Date(year,month,1).getDay();
        let lastDate=new Date(year,month+1,0).getDate();

        for(let i=0;i<firstDay;i++){
            const emptyDiv=document.createElement('div');
            emptyDiv.classList.add('calendar-day','empty');
            calendarEl.appendChild(emptyDiv);
        }

        for(let day=1;day<=lastDate;day++){
            const dayDiv=document.createElement('div');
            dayDiv.classList.add('calendar-day');
            dayDiv.textContent=day;
            if([5,12,18].includes(day)) dayDiv.classList.add('has-event');
            if(day===today.getDate() && month===today.getMonth() && year===today.getFullYear()) dayDiv.classList.add('current');
            calendarEl.appendChild(dayDiv);
        }
    }

    if(prevBtn) prevBtn.addEventListener('click', ()=>{
        currentMonth--;
        if(currentMonth<0){currentMonth=11;currentYear--;}
        renderCalendar(currentMonth,currentYear);
    });

    if(nextBtn) nextBtn.addEventListener('click', ()=>{
        currentMonth++;
        if(currentMonth>11){currentMonth=0;currentYear++;}
        renderCalendar(currentMonth,currentYear);
    });

    renderCalendar(currentMonth,currentYear);

    // ---- EDITAR NOME EXIBIDO ----
    const nomeSalvo = localStorage.getItem('usuarioExibido');
    if (nomeSalvo) {
        const elNome = el('usuario-exibido');
        if (elNome) elNome.textContent = nomeSalvo;
    }

   // ---- LISTA DE EVENTOS / LEMBRETES ----
    const lista = el('reminders-list');
    const inputTexto = el('novo-lembrete-texto');
    const inputData = el('novo-lembrete-data');
    const selectCor = el('novo-lembrete-cor');
    const addLembreteBtn = el('add-lembrete-btn');

    let lembretes = JSON.parse(localStorage.getItem('lembretes')) || [];

    function salvarLembretes() {
        localStorage.setItem('lembretes', JSON.stringify(lembretes));
    }

    function renderLembretes() {
        if (!lista) return;
        lista.innerHTML = '';
        lembretes.forEach((l, i) => {
            const li = document.createElement('li');
            li.className = 'reminder-item';

            const corDiv = document.createElement('div');
            corDiv.className = `reminder-color ${l.cor}`;
            li.appendChild(corDiv);

            const textoDiv = document.createElement('div');
            textoDiv.textContent = `${l.texto} - ${l.data}`;
            li.appendChild(textoDiv);

            li.appendChild(criarBotao('✎', '#6e1fff', () => {
                const novo = prompt('Editar lembrete:', l.texto);
                if (novo) {
                    lembretes[i].texto = novo;
                    salvarLembretes();
                    renderLembretes();
                }
            }));

            li.appendChild(criarBotao('x', '#ff5252', () => {
                lembretes.splice(i, 1);
                salvarLembretes();
                renderLembretes();
            }));

            lista.appendChild(li);
        });
    }

    if (addLembreteBtn) {
        addLembreteBtn.addEventListener('click', () => {
            const texto = inputTexto.value.trim();
            const data = inputData.value.trim();
            if (!texto || !data) {
                alert('Preencha lembrete e data!');
                return;
            }
            lembretes.push({ texto, cor: selectCor.value, data });
            salvarLembretes();
            renderLembretes();
            inputTexto.value = '';
            inputData.value = '';
        });
    }

    renderLembretes(); 
});



function atualizarTemaAtual(){
    const tema=document.documentElement.getAttribute('data-theme');
    const span=document.getElementById('tema-atual');
    if(span) span.textContent=(tema==='dark')?'Escuro ':'Claro ';
}

function toggleTheme(){
    const html=document.documentElement;
    const novo=html.getAttribute('data-theme')==='light'?'dark':'light';
    html.setAttribute('data-theme',novo);
    localStorage.setItem('theme',novo);
    atualizarTemaAtual();
}

// ---- FUNÇÃO GLOBAL EDITAR NOME ----
function editarNome() {
    const novo = prompt("Digite o novo nome exibido:");
    if (novo && novo.trim()) {
        const elNome = document.getElementById('usuario-exibido');
        if (elNome) elNome.textContent = novo.trim();
        localStorage.setItem('usuarioExibido', novo.trim());
        alert("Nome atualizado!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("faltas-grid");
  const btnAddMateria = document.getElementById("btnAddMateria");

  // Dados iniciais no localStorage
  let materias = JSON.parse(localStorage.getItem("materias")) || [
    { nome: "Matemática", total: 60, faltas: 10 },
    { nome: "Português", total: 50, faltas: 5 },
    { nome: "Física", total: 40, faltas: 15 }
  ];

  function salvarMaterias() {
    localStorage.setItem("materias", JSON.stringify(materias));
  }

  function calcularPresenca(total, faltas) {
    if (total <= 0) return 0;
    return ((total - faltas) / total) * 100;
  }

  function getCor(presenca) {
    if (presenca >= 75) return "materia-azul";
    if (presenca >= 50) return "materia-roxo";
    return "materia-rosa";
  }

  function renderMaterias() {
    grid.innerHTML = "";
    materias.forEach((m, i) => {
      const presenca = calcularPresenca(m.total, m.faltas);
      const card = document.createElement("div");
      card.className = "col-md-4";
      card.innerHTML = `
        <div class="materia-card ${getCor(presenca)}">
          <h4>${m.nome}</h4>
          <p>Total de aulas: ${m.total}</p>
          <p>Faltas: ${m.faltas}</p>
          <p><b>Presença: ${presenca.toFixed(1)}%</b></p>
          <button class="btn btn-light btn-sm" data-index="${i}" data-bs-toggle="modal" data-bs-target="#editModal">✏️ Editar</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Abrir modal para editar ou criar
  const editForm = document.getElementById("editForm");
  const editIndex = document.getElementById("edit-index");
  const editNome = document.getElementById("edit-nome");
  const editTotal = document.getElementById("edit-total");
  const editFaltas = document.getElementById("edit-faltas");

  grid.addEventListener("click", (e) => {
    if (e.target.matches("button[data-index]")) {
      const i = e.target.getAttribute("data-index");
      editIndex.value = i;
      editNome.value = materias[i].nome;
      editTotal.value = materias[i].total;
      editFaltas.value = materias[i].faltas;
    }
  });

  // Botão de adicionar matéria nova
  btnAddMateria.addEventListener("click", () => {
    editIndex.value = ""; // vazio => nova matéria
    editNome.value = "";
    editTotal.value = "";
    editFaltas.value = "";
    new bootstrap.Modal(document.getElementById("editModal")).show();
  });

  // Salvar alterações ou nova
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const i = editIndex.value;

    if (i === "") {
      // nova matéria
      materias.push({
        nome: editNome.value,
        total: parseInt(editTotal.value),
        faltas: parseInt(editFaltas.value)
      });
    } else {
      // editar existente
      materias[i].nome = editNome.value;
      materias[i].total = parseInt(editTotal.value);
      materias[i].faltas = parseInt(editFaltas.value);
    }

    salvarMaterias();
    renderMaterias();
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
  });

  // Primeira renderização
  renderMaterias();
});

