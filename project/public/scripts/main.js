BASE_URL = 'https://apiv3.apifootball.com/'
API_KEY = '4190df28c8a2a38952da0d784ba43e86d7e1c1ca54560544c3786a88b867e0cf'

async function loadPlayers() {
    try{
        const response = await fetch('/jogadores');
        const jogadores = await response.json();
        console.log(jogadores);
        const lista = document.getElementById('tabela');
        lista.innerHTML = '';

        jogadores.forEach(jogador => {
            const li = document.createElement('li');
            li.textContent = `${jogador.nome}`;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error(error)
    }
}

async function loadTable() {
    try {
        const response = await fetch(`${BASE_URL}?action=get_standings&league_id=99&APIkey=${API_KEY}`);
        const tabela = await response.json();

        const tbody = document.querySelector('#tabela tbody');
        tabela.forEach(time => {
            const row = document.createElement('tr');
            row.innerHTML = 
                `
                    <td>${time.overall_league_position}</td>
                    <td id="time_nome">
                        <a href="/time?time_id=${time.team_id}">
                        <img src="${time.team_badge}" alt="${time.team_name}" style="width: 30px; height: 30px; vertical-align: middle; margin-right: 8px;">
                        ${time.team_name}
                        </a>
                    </td>
                    <td>${time.overall_league_PTS}</td>
                    <td>${time.overall_league_payed}</td>
                    <td>${time.overall_league_W}</td>
                    <td>${time.overall_league_D}</td>
                    <td>${time.overall_league_L}</td>
                    <td>${time.overall_league_GF} : ${time.overall_league_GA}</td>
                `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}

loadTable();
//carregarJogadores();