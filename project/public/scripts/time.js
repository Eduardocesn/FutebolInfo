async function loadTime() {
    try {
        const time_id = getParametro('time_id');
        const response = await fetch(`/api/time/jogadores/${time_id}`);
        const json = await response.json();
        console.log(json);
        const title = document.getElementById('title');
        title.innerHTML = `<h2><img src="${json.time.escudo}" alt="${json.time.nome}" style="width: 30px; height: 30px; vertical-align: middle; margin-right: 8px;">${json.time.nome}</h2>`

        const jogadoresContainer = document.getElementById('jogadores');
        json.jogadores.forEach(jogador => {
            const div = document.createElement('div');
            div.className = 'jogador';
            const imgSrc = jogador.foto == '' ? 'https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png-1.jpg' : jogador.foto;
            div.innerHTML = `
                <div class="jogador_info" onclick="toggleStats('${jogador.id}')">
                    <img src="${imgSrc}" class="foto" alt="${jogador.nome}">
                    <span>${jogador.nome} - ${jogador.posicao}</span>
                </div>
                <div class="estatistica" id="estatisticas_${jogador.id}">
                    <p>Idade: ${jogador.idade}</p>
                    <p>Gols: ${jogador.gols}</p>
                    <p>Partidas jogadas: ${jogador.partidas_jogadas}</p>
                    <p>Cartões amarelos: ${jogador.cartoes_amarelos}</p>
                    <p>Cartões vermelhos: ${jogador.cartoes_vermelhos}</p>
                    <p>Chutes: ${jogador.chutes}</p>
                    <p>Faltas: ${jogador.faltas}</p>
                    <p>Passes: ${jogador.passes}</p>
                </div>
                `;
            jogadoresContainer.appendChild(div);
        });
    } catch(err) {
        console.error(err);
    }
}

function toggleStats(id) {
    const stats = document.getElementById(`estatisticas_${id}`);
    stats.style.display = stats.style.display === 'none' || stats.style.display === '' ? 'block' : 'none';
}

function getParametro(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

loadTime();