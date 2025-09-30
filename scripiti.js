document.addEventListener('DOMContentLoaded', function () {

    const grupEl = document.getElementById('grup');
    const button = document.getElementById('add');
    const popElement = document.getElementById('pop');
    const textInput = document.getElementById('novo_grupo');
    const addNovoBtn = document.getElementById('add_novo');
    const taskTable = document.getElementById('task-table');
    const mapasEl = document.getElementById('mapas');
    const buttonMapas = document.getElementById('add-mapas');
    const popMapas = document.getElementById('pop-mapas');
    const textMapa = document.getElementById('novo_mapa');
    const addMapaBtn = document.getElementById('add_novo_mapa');
    const mapaTable = document.getElementById('mapa-table');

    // abrir grupos
    window.displaygrupo = function () {
        if (getComputedStyle(grupEl).display === 'none') {
            grupEl.style.display = 'block';
        } else {
            grupEl.style.display = 'none';
        }
    };

    // abrir/fechar o input
    button.addEventListener('click', function () {
        if (getComputedStyle(popElement).display === 'none') {
            popElement.style.display = 'block';
            button.textContent = 'fechar';
            textInput.focus();
        } else {
            popElement.style.display = 'none';
            button.textContent = '+';
        }
    });

    // adicionar novo grupo à lista
    addNovoBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const nomeGrupo = textInput.value.trim();
        if (!nomeGrupo) {
            alert('Digite um nome para o grupo!');
            textInput.focus();
            return;
        }

        const li = document.createElement('li');
        li.textContent = nomeGrupo;
        taskTable.appendChild(li);

        // limpar input e fechar pop
        textInput.value = '';
        popElement.style.display = 'none';
        button.textContent = '+';
    });

    // função para abrir/fechar a seção "Mapas Mentais"
    window.displaymapas = function () {
        if (getComputedStyle(mapasEl).display === 'none') {
            mapasEl.style.display = 'block';
        } else {
            mapasEl.style.display = 'none';
        }
    };

    // botão + para abrir/fechar pop-mapas
    buttonMapas.addEventListener('click', function () {
        if (getComputedStyle(popMapas).display === 'none') {
            popMapas.style.display = 'block';
            buttonMapas.textContent = 'fechar';
            textMapa.focus();
        } else {
            popMapas.style.display = 'none';
            buttonMapas.textContent = '+';
        }
    });

    // botão criar → adicionar mapa mental na lista
    addMapaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const nomeMapa = textMapa.value.trim();
        if (!nomeMapa) {
            alert('Digite um nome para o mapa mental!');
            textMapa.focus();
            return;
        }

        const li = document.createElement('li');
        li.textContent = nomeMapa;
        mapaTable.appendChild(li);

        // limpar input e fechar pop
        textMapa.value = '';
        popMapas.style.display = 'none';
        buttonMapas.textContent = '+';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const notifBtn = document.getElementById('notif-btn');
    const notifPop = document.getElementById('notif-pop');

    notifBtn.addEventListener('click', function () {
        if (getComputedStyle(notifPop).display === 'none') {
            notifPop.style.display = 'block';
        } else {
            notifPop.style.display = 'none';
        }
    });

    // fecha notif se clicar fora
    document.addEventListener('click', function (e) {
        if (!notifPop.contains(e.target) && e.target !== notifBtn) {
            notifPop.style.display = 'none';
        }
    });
    function showSection(sectionId) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(sec => sec.style.display = 'none'); // esconde todas
        document.getElementById(sectionId).style.display = 'block'; // mostra a clicada
    }

    function logout() {
        if (confirm("Deseja sair da conta?")) {
            window.location.href = "login.html";
        }
    }

});

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
        document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
        // define como claro se não tiver nada salvo
        document.documentElement.setAttribute("data-theme", "light");
    }
});

// Alterna o tema e salva
function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}

