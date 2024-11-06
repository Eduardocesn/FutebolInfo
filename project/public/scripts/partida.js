async function getPartida() {
    try {
        const partida_id = getParametro('partida_id');
        const response = await fetch(`/api/partidas/${partida_id}`);
        const json = await response.json();
        const time_casa = await (await fetch(`/api/time/${json.partida.time_casa_id}`)).json();
        const time_visitante = await (await fetch(`/api/time/${json.partida.time_visitante_id}`)).json();

        displayCards(json);
        displayGoals(json);
        displayStats(json);
        displaySubs(json);
        const title = document.getElementById('title');
        const li = document.createElement('li');
        li.className = 'partida';
        li.innerHTML = `
                <a href="time?time_id=${time_casa.id}">
                <span class="time">
                    <img src="${time_casa.escudo}" alt="${time_casa.nome}" style="width: 30px; height: 30px; vertical-align: middle; margin-right: 8px;">
                    ${time_casa.nome}
                </span> 
                </a>
                <strong>${json.partida.gols_casa} x ${json.partida.gols_visitante}</strong>
                <a href="time?time_id=${time_visitante.id}">
                <span class="time">
                    <img src="${time_visitante.escudo}" alt="${time_visitante.nome}" style="width: 30px; height: 30px; vertical-align: middle; margin-right: 8px;">
                    ${time_visitante.nome}
                </span>
                </a>
                <span class="data">${formataData(json.partida.data)}</span>
            `;
        title.appendChild(li);

        const li2 = document.createElement('li');
        li2.className = 'partida';
        li2.innerHTML = `
        <p>Estádio: ${json.partida.estadio}</p>
        <p>Árbitro: ${json.partida.arbitro}</p>
        `;
        title.appendChild(li2);
    } catch (err) {
        console.error(err);
    }
}

async function displayCards(data) {
    const cards_casa = document.getElementById('cards_casa');
    const cards_visitante = document.getElementById('cards_visitante');
    data.cartoes.forEach(async cartao => {
        const jogador = await (await fetch(`/api/jogador/${cartao.jogador_id}`)).json();
        var img;
        if (cartao.tipo == 'Amarelo') {
            img = '<img src="https://w7.pngwing.com/pngs/942/268/png-transparent-penalty-card-yellow-card-association-football-referee-sim-cards-electronics-rectangle-color-thumbnail.png" style="width: 22px; height: 30px; margin-right:10px; vertical-align:middle;"></img>'
        } else {
            img = '<img src="https://e7.pngegg.com/pngimages/272/75/png-clipart-penalty-card-association-football-referee-player-card-game-sport-thumbnail.png" style="width: 22px; height: 30px; margin-right:10px; vertical-align:middle;"></img>'
        }
        const div = `<div class="stat">${img} ${jogador.nome} ${cartao.minuto}'</div>`;
        if (jogador.time_id == data.partida.time_casa_id) {
            cards_casa.innerHTML += div;
        } else {
            cards_visitante.innerHTML += div;
        }
    });
}

async function displayGoals(data) {
    const gols_casa = document.getElementById('gols_casa');
    const gols_visitante = document.getElementById('gols_visitante');

    data.gols.forEach(async gol => {
        var jogador;
        if (gol.gol_casa) {
            jogador = await (await fetch(`/api/jogador/${gol.gol_casa}`)).json();
            const div = `<div class="stat"><img src="https://ssl.gstatic.com/onebox/sports/game_feed/goal_icon.svg" style="margin-right:10px; vertical-align:middle;">${jogador.nome} ${gol.tempo}'</div>`;
            gols_casa.innerHTML += div;
        } else {
            jogador = await (await fetch(`/api/jogador/${gol.gol_visitante}`)).json();
            const div = `<div class="stat"><img src="https://ssl.gstatic.com/onebox/sports/game_feed/goal_icon.svg" style="margin-right:10px; vertical-align:middle;">${jogador.nome} ${gol.tempo}'</div>`;
            gols_visitante.innerHTML += div;
        }
    })
}

async function displayStats(data) {
    const stats = document.getElementById('stats');
    data.estatisticas.forEach(stat => {
        stats.innerHTML += `<div class="stat">${stat.tipo} - Casa: ${stat.casa}, Visitante: ${stat.visitante}</div>`;
    })
}

async function displaySubs(data) {
    const subs_casa = document.getElementById('subs_casa');
    const subs_visitante = document.getElementById('subs_visitante');

    data.subs.forEach(sub => {
        const div = `<div class="stat"><img src="https://cdn-icons-png.flaticon.com/512/3507/3507769.png" style="width: 25px; height: 25px; vertical-align: middle; margin-right: 8px;">${sub.substituicao} ${sub.minuto}'</div>`
        if (sub.time_id == data.partida.time_casa_id) {
            subs_casa.innerHTML += div;
        } else {
            subs_visitante.innerHTML += div;
        }
    })
}

function getParametro(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function formataData(dataPartida) {
    const data = new Date(dataPartida);

    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

getPartida();