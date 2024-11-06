async function loadPartidas() {
    try {
        const response = await fetch('/api/partidas');
        const partidas = await response.json();
        const lista = document.getElementById('lista');
        lista.innerHTML = '';

        const partidasComTimes = await Promise.all(partidas.map(async partida => {
            const response_casa = await fetch(`/api/time/${partida.time_casa_id}`);
            const time_casa = await response_casa.json();
            const response_visitante = await fetch(`/api/time/${partida.time_visitante_id}`);
            const time_visitante = await response_visitante.json();

            return {partida, time_casa, time_visitante};
        }))

        partidasComTimes.forEach(({partida, time_casa, time_visitante}) => {
            const li = document.createElement('li');
            li.className = 'partida';
            li.innerHTML = `
            <a href="partida?partida_id=${partida.id}">
                <span class="time">
                    <img src="${time_casa.escudo}" alt="${time_casa.nome}" style="width: 30px; height: 30px; vertical-align: middle; margin-right: 8px;">
                    ${time_casa.nome}
                </span> 
                <strong>${partida.gols_casa} x ${partida.gols_visitante}</strong>
                <span class="time">
                    <img src="${time_visitante.escudo}" alt="${time_visitante.nome}" style="width: 30px; height: 30px; vertical-align: middle; margin-right: 8px;">
                    ${time_visitante.nome}
                </span>
                <span class="data">${formataData(partida.data)}</span>
            </a>
            `;
            lista.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}

function formataData(dataPartida) {
    const data = new Date(dataPartida);

    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

loadPartidas();