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

    // ========================================
    // ---- CALENDÁRIO COM ANOTAÇÕES ----
    // ========================================

    const calendarEl = el('calendar');
    const monthYearEl = el('month-year');
    const prevBtn = el('prev-month');
    const nextBtn = el('next-month');

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let anotacoesCalendario = JSON.parse(localStorage.getItem('anotacoesCalendario')) || {};

    // Formata data para chave (YYYY-MM-DD)
    function formatarDataChave(ano, mes, dia) {
        return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    }

    // Salva anotações do calendário
    function salvarAnotacoesCalendario() {
        localStorage.setItem('anotacoesCalendario', JSON.stringify(anotacoesCalendario));

        // Dispara o evento para atualizar o painel lateral
        document.dispatchEvent(new Event('lembreteAtualizado'));
    }

    // Renderiza o calendário com anotações
    function renderCalendar(month, year) {
        if (!calendarEl || !monthYearEl) return;

        monthYearEl.textContent = `${monthNames[month]} ${year}`;
        calendarEl.innerHTML = '';

        // Cabeçalho dos dias da semana
        const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        diasSemana.forEach(d => {
            const headerDay = document.createElement('div');
            headerDay.className = 'calendar-header';
            headerDay.textContent = d;
            calendarEl.appendChild(headerDay);
        });

        // Primeiro dia do mês e total de dias
        let firstDay = new Date(year, month, 1).getDay();
        let lastDate = new Date(year, month + 1, 0).getDate();

        // Dias vazios antes do início do mês
        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('calendar-day', 'empty');
            calendarEl.appendChild(emptyDiv);
        }

        // Dias do mês
        for (let day = 1; day <= lastDate; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day');

            const dataChave = formatarDataChave(year, month, day);

            // Verifica se é hoje
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.classList.add('today');
            }

            // Verifica se tem anotações
            if (anotacoesCalendario[dataChave] && anotacoesCalendario[dataChave].length > 0) {
                dayDiv.classList.add('has-notes');

                // Adiciona indicador de quantidade
                const indicator = document.createElement('span');
                indicator.className = 'notes-indicator';
                indicator.textContent = anotacoesCalendario[dataChave].length;
                dayDiv.appendChild(indicator);
            }

            dayDiv.innerHTML = `<span class="day-number">${day}</span>` + (dayDiv.innerHTML || '');

            // Click para abrir modal de anotações
            dayDiv.addEventListener('click', () => abrirModalAnotacoes(year, month, day));

            calendarEl.appendChild(dayDiv);
        }
    }

    // Abre modal para adicionar/ver anotações
    function abrirModalAnotacoes(ano, mes, dia) {
        const dataChave = formatarDataChave(ano, mes, dia);
        const dataFormatada = `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}/${ano}`;

        // Remove modal existente se houver
        const modalExistente = document.querySelector('.modal-anotacoes');
        if (modalExistente) modalExistente.remove();

        // Cria modal
        const modal = document.createElement('div');
        modal.className = 'modal-anotacoes';
        modal.innerHTML = `
            <div class="modal-content-anotacoes">
                <div class="modal-header-anotacoes">
                    <h3>Anotações - ${dataFormatada}</h3>
                    <button class="close-modal">×</button>
                </div>
                <div class="modal-body-anotacoes">
                    <div class="add-anotacao">
                        <textarea id="nova-anotacao-${dataChave}" placeholder="Digite sua anotação..." rows="3"></textarea>
                        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                            <label style="display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox" id="criar-lembrete-${dataChave}">
                                <span style="font-size: 14px;">Criar lembrete também</span>
                            </label>
                            <select id="cor-lembrete-${dataChave}" style="padding: 5px; border-radius: 5px;">
                                <option value="pink">Rosa</option>
                                <option value="purple">Roxo</option>
                            </select>
                        </div>
                        <button id="btn-add-anotacao-${dataChave}">Adicionar Anotação</button>
                    </div>
                    <div class="lista-anotacoes" id="lista-anotacoes-${dataChave}"></div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Renderiza anotações existentes
        renderizarAnotacoes(dataChave);

        // Evento para fechar modal
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());

        // Evento para adicionar anotação
        const btnAdd = document.getElementById(`btn-add-anotacao-${dataChave}`);
        const textarea = document.getElementById(`nova-anotacao-${dataChave}`);
        const checkLembrete = document.getElementById(`criar-lembrete-${dataChave}`);
        const corLembrete = document.getElementById(`cor-lembrete-${dataChave}`);

        btnAdd.addEventListener('click', () => {
            const texto = textarea.value.trim();

            if (texto) {
                if (!anotacoesCalendario[dataChave]) {
                    anotacoesCalendario[dataChave] = [];
                }

                // Adiciona anotação no calendário
                anotacoesCalendario[dataChave].push(texto);
                salvarAnotacoesCalendario();

                // Se marcou para criar lembrete, cria também
                if (checkLembrete.checked) {
                    const novoLembrete = {
                        texto: texto.replace('📌 ', ''), // Remove emoji se existir
                        cor: corLembrete.value,
                        data: converterChaveParaData(dataChave)
                    };
                    lembretes.push(novoLembrete);
                    salvarLembretes();
                    renderLembretes();
                }

                textarea.value = '';
                checkLembrete.checked = false;
                renderizarAnotacoes(dataChave);
                renderCalendar(currentMonth, currentYear);
            }
        });

        // Fecha modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Renderiza lista de anotações no modal
    function renderizarAnotacoes(dataChave) {
        const lista = document.getElementById(`lista-anotacoes-${dataChave}`);
        if (!lista) return;

        lista.innerHTML = '';

        if (!anotacoesCalendario[dataChave] || anotacoesCalendario[dataChave].length === 0) {
            lista.innerHTML = '<p class="sem-anotacoes">Nenhuma anotação para este dia</p>';
            return;
        }

        anotacoesCalendario[dataChave].forEach((anotacao, index) => {
            const item = document.createElement('div');
            item.className = 'anotacao-item';

            // Verifica se é um lembrete sincronizado (tem emoji 📌)
            const isLembrete = anotacao.startsWith('📌');
            const textoLimpo = anotacao.replace('📌 ', '');

            item.innerHTML = `
                <div class="anotacao-texto">${anotacao}</div>
                <div class="anotacao-actions">
                    <button class="btn-editar" title="Editar">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    <button class="btn-excluir" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    ${isLembrete ? '<span class="badge-lembrete" title="Sincronizado com lembretes">🔔</span>' : ''}
                </div>
            `;

            // Evento de excluir
            item.querySelector('.btn-excluir').addEventListener('click', () => {
                if (confirm('Deseja excluir esta anotação?')) {
                    // Se for lembrete, remove também da lista de lembretes
                    if (isLembrete) {
                        const dataFormatada = converterChaveParaData(dataChave);
                        const indexLembrete = lembretes.findIndex(l =>
                            l.texto === textoLimpo && l.data === dataFormatada
                        );
                        if (indexLembrete > -1) {
                            lembretes.splice(indexLembrete, 1);
                            salvarLembretes();
                            renderLembretes();
                        }
                    }

                    anotacoesCalendario[dataChave].splice(index, 1);
                    if (anotacoesCalendario[dataChave].length === 0) {
                        delete anotacoesCalendario[dataChave];
                    }
                    salvarAnotacoesCalendario();
                    renderizarAnotacoes(dataChave);
                    renderCalendar(currentMonth, currentYear);
                }
            });

            // Evento de editar
            item.querySelector('.btn-editar').addEventListener('click', () => {
                const novoTexto = prompt('Editar anotação:', textoLimpo);
                if (novoTexto !== null && novoTexto.trim()) {
                    const textoFinal = isLembrete ? `📌 ${novoTexto.trim()}` : novoTexto.trim();

                    // Se for lembrete, atualiza também na lista de lembretes
                    if (isLembrete) {
                        const dataFormatada = converterChaveParaData(dataChave);
                        const indexLembrete = lembretes.findIndex(l =>
                            l.texto === textoLimpo && l.data === dataFormatada
                        );
                        if (indexLembrete > -1) {
                            lembretes[indexLembrete].texto = novoTexto.trim();
                            salvarLembretes();
                            renderLembretes();
                        }
                    }

                    anotacoesCalendario[dataChave][index] = textoFinal;
                    salvarAnotacoesCalendario();
                    renderizarAnotacoes(dataChave);
                }
            });

            lista.appendChild(item);
        });
    }

    // Navegação do calendário
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });
    }

    // Inicializa o calendário
    renderCalendar(currentMonth, currentYear);

    // ========================================
    // EXPORTAR PARA GOOGLE CALENDAR (.ics)
    // ========================================

    function exportarParaGoogleCalendar() {
        if (Object.keys(anotacoesCalendario).length === 0) {
            alert('Não há anotações para exportar!');
            return;
        }

        // Cria conteúdo do arquivo .ics
        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Aurea//Sistema de Estudos//PT',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'X-WR-CALNAME:Anotações Aurea',
            'X-WR-TIMEZONE:America/Sao_Paulo'
        ];

        // Adiciona cada anotação como evento
        Object.keys(anotacoesCalendario).forEach(dataChave => {
            const anotacoes = anotacoesCalendario[dataChave];
            anotacoes.forEach((anotacao, index) => {
                // Formata a data para o formato do .ics (YYYYMMDD)
                const dataFormatada = dataChave.replace(/-/g, '');

                // Gera um UID único para cada evento
                const uid = `${dataChave}-${index}@aurea.com`;

                // Timestamp de criação
                const agora = new Date();
                const timestamp = agora.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

                icsContent.push('BEGIN:VEVENT');
                icsContent.push(`UID:${uid}`);
                icsContent.push(`DTSTAMP:${timestamp}`);
                icsContent.push(`DTSTART;VALUE=DATE:${dataFormatada}`);
                icsContent.push(`DTEND;VALUE=DATE:${dataFormatada}`);
                icsContent.push(`SUMMARY:${anotacao.replace(/\n/g, '\\n')}`);
                icsContent.push('DESCRIPTION:Anotação criada no sistema Aurea');
                icsContent.push('STATUS:CONFIRMED');
                icsContent.push('TRANSP:TRANSPARENT');
                icsContent.push('END:VEVENT');
            });
        });

        icsContent.push('END:VCALENDAR');

        // Cria o arquivo para download
        const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'aurea_anotacoes.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('✅ Arquivo exportado! Agora:\n\n1. Abra o Google Calendar\n2. Clique em "Configurações" > "Importar e exportar"\n3. Clique em "Selecionar arquivo do computador"\n4. Escolha o arquivo "aurea_anotacoes.ics"\n5. Clique em "Importar"');
    }

    // ========================================
    // IMPORTAR DO GOOGLE CALENDAR (.ics)
    // ========================================

    function importarDoGoogleCalendar() {
        // Cria input file invisível
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.ics';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const icsContent = event.target.result;
                    const eventos = parseICS(icsContent);

                    if (eventos.length === 0) {
                        alert('Nenhum evento encontrado no arquivo!');
                        return;
                    }

                    // Adiciona eventos ao calendário
                    let importados = 0;
                    eventos.forEach(evento => {
                        if (evento.data && evento.titulo) {
                            if (!anotacoesCalendario[evento.data]) {
                                anotacoesCalendario[evento.data] = [];
                            }
                            // Evita duplicatas
                            if (!anotacoesCalendario[evento.data].includes(evento.titulo)) {
                                anotacoesCalendario[evento.data].push(evento.titulo);
                                importados++;
                            }
                        }
                    });

                    salvarAnotacoesCalendario();
                    renderCalendar(currentMonth, currentYear);

                    alert(`✅ Importação concluída!\n\n${importados} evento(s) importado(s) com sucesso!`);
                } catch (error) {
                    alert('❌ Erro ao importar arquivo. Certifique-se de que é um arquivo .ics válido do Google Calendar.');
                    console.error('Erro ao importar:', error);
                }
            };

            reader.readAsText(file);
        });

        input.click();
    }

    function parseICS(icsContent) {
        const eventos = [];
        const linhas = icsContent.split(/\r?\n/);
        let eventoAtual = null;

        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i].trim();

            // Verifica se a linha continua na próxima (RFC 5545)
            while (i + 1 < linhas.length && linhas[i + 1].match(/^[ \t]/)) {
                i++;
                linha += linhas[i].trim();
            }

            if (linha === 'BEGIN:VEVENT') {
                eventoAtual = { titulo: '', data: '', descricao: '' };
            } else if (linha === 'END:VEVENT' && eventoAtual) {
                if (eventoAtual.data && eventoAtual.titulo) {
                    eventos.push(eventoAtual);
                }
                eventoAtual = null;
            } else if (eventoAtual) {
                // SUMMARY (título do evento)
                if (linha.startsWith('SUMMARY:')) {
                    eventoAtual.titulo = linha.substring(8).replace(/\\n/g, ' ').trim();
                }

                // DTSTART (data de início)
                else if (linha.startsWith('DTSTART')) {
                    const match = linha.match(/:([\d]{8})/);
                    if (match) {
                        const dataStr = match[1]; // YYYYMMDD
                        const ano = dataStr.substring(0, 4);
                        const mes = dataStr.substring(4, 6);
                        const dia = dataStr.substring(6, 8);
                        eventoAtual.data = `${ano}-${mes}-${dia}`;
                    }
                }

                // DESCRIPTION (descrição do evento)
                else if (linha.startsWith('DESCRIPTION:')) {
                    eventoAtual.descricao = linha.substring(12).replace(/\\n/g, ' ').trim();
                }
            }
        }

        return eventos;
    }

    // Adiciona botões de exportar/importar no calendário
    const botoesCalendario = document.createElement('div');
    botoesCalendario.className = 'calendar-actions';

    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn-export-calendar';
    exportBtn.innerHTML = '<i class="fa-solid fa-download"></i> Exportar para Google Calendar';
    exportBtn.addEventListener('click', exportarParaGoogleCalendar);

    const importBtn = document.createElement('button');
    importBtn.className = 'btn-import-calendar';
    importBtn.innerHTML = '<i class="fa-solid fa-upload"></i> Importar do Google Calendar';
    importBtn.addEventListener('click', importarDoGoogleCalendar);

    botoesCalendario.appendChild(importBtn);
    botoesCalendario.appendChild(exportBtn);

    // Adiciona os botões após o calendário
    if (calendarEl && calendarEl.parentNode) {
        calendarEl.parentNode.appendChild(botoesCalendario);
    }

    // CSS adicional para o calendário com anotações
    const style = document.createElement('style');
    style.textContent = `
        .calendar {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
            padding: 10px;
        }
        
        .calendar-header {
            text-align: center;
            font-weight: bold;
            padding: 10px;
            background: rgba(110, 31, 255, 0.1);
            border-radius: 5px;
            font-size: 12px;
        }
        
        .calendar-day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
            background: white;
            font-size: 14px;
        }
        
        [data-theme="dark"] .calendar-day {
            background: #2a2a2a;
            border-color: #444;
        }
        
        .calendar-day:not(.empty):hover {
            background: rgba(110, 31, 255, 0.1);
            transform: scale(1.05);
        }
        
        .calendar-day.empty {
            background: transparent;
            border: none;
            cursor: default;
        }
        
        .calendar-day.today {
            background: rgba(110, 31, 255, 0.2);
            font-weight: bold;
            border: 2px solid #6e1fff;
        }
        
        .calendar-day.has-notes {
            background: rgba(255, 192, 203, 0.3);
            border-color: #ff69b4;
        }
        
        [data-theme="dark"] .calendar-day.has-notes {
            background: rgba(255, 192, 203, 0.2);
        }
        
        .day-number {
            position: relative;
            z-index: 1;
        }
        
        .notes-indicator {
            position: absolute;
            top: 2px;
            right: 2px;
            background: #6e1fff;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
        }
        
        .modal-anotacoes {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: fadeIn 0.2s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content-anotacoes {
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            animation: slideUp 0.3s;
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        [data-theme="dark"] .modal-content-anotacoes {
            background: #2a2a2a;
            color: white;
        }
        
        .modal-header-anotacoes {
            padding: 20px;
            border-bottom: 2px solid #6e1fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header-anotacoes h3 {
            margin: 0;
            color: #6e1fff;
            font-size: 20px;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 32px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            line-height: 1;
            transition: color 0.2s;
        }
        
        .close-modal:hover {
            color: #6e1fff;
        }
        
        .modal-body-anotacoes {
            padding: 20px;
            overflow-y: auto;
        }
        
        .add-anotacao {
            margin-bottom: 20px;
        }
        
        .add-anotacao textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            resize: vertical;
            font-family: inherit;
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .add-anotacao textarea:focus {
            outline: none;
            border-color: #6e1fff;
        }
        
        [data-theme="dark"] .add-anotacao textarea {
            background: #1a1a1a;
            border-color: #444;
            color: white;
        }
        
        .add-anotacao button {
            width: 100%;
            padding: 12px;
            background: #6e1fff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            transition: background 0.2s;
        }
        
        .add-anotacao button:hover {
            background: #5a19cc;
        }
        
        .lista-anotacoes {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .anotacao-item {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.2s;
        }
        
        @keyframes slideIn {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        [data-theme="dark"] .anotacao-item {
            background: #1a1a1a;
        }
        
        .anotacao-texto {
            flex: 1;
            word-wrap: break-word;
            line-height: 1.5;
        }
        
        .anotacao-actions {
            display: flex;
            gap: 5px;
            flex-shrink: 0;
        }
        
        .btn-editar, .btn-excluir {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 5px;
            transition: all 0.2s;
            font-size: 16px;
        }
        
        .btn-editar {
            color: #6e1fff;
        }
        
        .btn-editar:hover {
            background: rgba(110, 31, 255, 0.1);
        }
        
        .btn-excluir {
            color: #ff4444;
        }
        
        .btn-excluir:hover {
            background: rgba(255, 68, 68, 0.1);
        }
        
        .sem-anotacoes {
            text-align: center;
            color: #999;
            font-style: italic;
            padding: 30px 20px;
        }
        
        .badge-lembrete {
            font-size: 14px;
            margin-left: 5px;
        }
        
        .calendar-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 15px;
        }
        
        .btn-export-calendar,
        .btn-import-calendar {
            padding: 12px 20px;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s;
        }
        
        .btn-import-calendar {
            background: linear-gradient(135deg, #34a853, #0f9d58);
            box-shadow: 0 4px 15px rgba(52, 168, 83, 0.3);
        }
        
        .btn-import-calendar:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(52, 168, 83, 0.4);
        }
        
        .btn-export-calendar {
            background: linear-gradient(135deg, #4285f4, #357ae8);
            box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
        }
        
        .btn-export-calendar:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(66, 133, 244, 0.4);
        }
        
        .btn-export-calendar:active,
        .btn-import-calendar:active {
            transform: translateY(0);
        }
        
        .btn-export-calendar i,
        .btn-import-calendar i {
            font-size: 16px;
        }
        
        @media (max-width: 600px) {
            .calendar-actions {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // FIM DO CALENDÁRIO COM ANOTAÇÕES
    // ========================================

    // ---- EDITAR NOME EXIBIDO ----
    const nomeSalvo = localStorage.getItem('usuarioExibido');
    if (nomeSalvo) {
        const elNome = el('usuario-exibido');
        if (elNome) elNome.textContent = nomeSalvo;
    }

    // ========================================
    // SINCRONIZAÇÃO LEMBRETES + CALENDÁRIO
    // ========================================

    const lista = el('reminders-list');
    const inputTexto = el('novo-lembrete-texto');
    const inputData = el('novo-lembrete-data');
    const selectCor = el('novo-lembrete-cor');
    const addLembreteBtn = el('add-lembrete-btn');

    let lembretes = JSON.parse(localStorage.getItem('lembretes')) || [];

    // Converte data DD/MM/YYYY para YYYY-MM-DD
    function converterDataParaChave(dataStr) {
        if (dataStr.includes('-')) return dataStr; // Já está no formato correto
        const partes = dataStr.split('/');
        if (partes.length === 3) {
            return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        }
        return null;
    }

    // Converte data YYYY-MM-DD para DD/MM/YYYY
    function converterChaveParaData(dataChave) {
        const partes = dataChave.split('-');
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return dataChave;
    }

    function salvarLembretes() {
        localStorage.setItem('lembretes', JSON.stringify(lembretes));
        // Dispara o evento para atualizar o painel lateral
        document.dispatchEvent(new Event('lembreteAtualizado'));
    }

    // Sincroniza lembretes com calendário
    function sincronizarLembreteParaCalendario(lembrete) {
        const dataChave = converterDataParaChave(lembrete.data);
        if (!dataChave) return;

        if (!anotacoesCalendario[dataChave]) {
            anotacoesCalendario[dataChave] = [];
        }

        // Adiciona se não existir
        const textoCompleto = `📌 ${lembrete.texto}`;
        if (!anotacoesCalendario[dataChave].includes(textoCompleto)) {
            anotacoesCalendario[dataChave].push(textoCompleto);
            salvarAnotacoesCalendario();
        }
    }

    // Remove lembrete do calendário
    function removerLembreteDoCalendario(lembrete) {
        const dataChave = converterDataParaChave(lembrete.data);
        if (!dataChave || !anotacoesCalendario[dataChave]) return;

        const textoCompleto = `📌 ${lembrete.texto}`;
        const index = anotacoesCalendario[dataChave].indexOf(textoCompleto);
        if (index > -1) {
            anotacoesCalendario[dataChave].splice(index, 1);
            if (anotacoesCalendario[dataChave].length === 0) {
                delete anotacoesCalendario[dataChave];
            }
            salvarAnotacoesCalendario();
        }
    }

    // Atualiza lembrete no calendário
    function atualizarLembreteNoCalendario(lembreteAntigo, lembreteNovo) {
        removerLembreteDoCalendario(lembreteAntigo);
        sincronizarLembreteParaCalendario(lembreteNovo);
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
                const lembreteAntigo = { ...l };
                const novoTexto = prompt('Editar lembrete:', l.texto);
                if (novoTexto && novoTexto.trim()) {
                    lembretes[i].texto = novoTexto.trim();
                    atualizarLembreteNoCalendario(lembreteAntigo, lembretes[i]);
                    salvarLembretes();
                    renderLembretes();
                    renderCalendar(currentMonth, currentYear);
                }
            }));

            li.appendChild(criarBotao('x', '#ff5252', () => {
                if (confirm('Deseja excluir este lembrete?')) {
                    removerLembreteDoCalendario(lembretes[i]);
                    lembretes.splice(i, 1);
                    salvarLembretes();
                    renderLembretes();
                    renderCalendar(currentMonth, currentYear);
                }
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

            const novoLembrete = { texto, cor: selectCor.value, data };
            lembretes.push(novoLembrete);

            // Sincroniza com calendário
            sincronizarLembreteParaCalendario(novoLembrete);

            salvarLembretes();
            renderLembretes();
            renderCalendar(currentMonth, currentYear);

            inputTexto.value = '';
            inputData.value = '';
        });
    }

    renderLembretes();
});

function atualizarTemaAtual() {
    const tema = document.documentElement.getAttribute('data-theme');
    const span = document.getElementById('tema-atual');
    if (span) span.textContent = (tema === 'dark') ? 'Escuro ' : 'Claro ';
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
