const express = require('express');
const { Client } = require('pg');
const path = require('path');

const app = express()
const port = 8000

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'futebol',
    password: 'postgres',
    port: 5432,
})

client.connect();
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/partidas', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'partidas.html'));
})

app.get('/time', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'time.html'));
})

app.get('/partida', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'partida.html'));
})

app.get('/api/time/jogadores/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const time = (await client.query(`SELECT * from Time WHERE id='${id}'`)).rows[0];
        const jogadores = (await client.query(`SELECT * from Jogador WHERE time_id='${id}'`)).rows;
        res.json({time, jogadores});
    } catch (err) {
        console.error(err);
    }
})

app.get('/api/time/:id', (req, res) => {
    try {
        const id = req.params.id;
        client.query(`SELECT * from Time where id = '${id}'`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({error: 'Erro ao consultar o banco'});
            }
            if (results.length == 0) {
                return res.status(400).json({message: 'Time não encontrado'});
            }
            return res.json(results.rows[0]);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro');
    }
})

app.get('/api/jogador/:id', (req, res) => {
    try {
        const id = req.params.id;
        client.query(`SELECT * from Jogador where id = '${id}'`, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({error: 'Erro ao consultar o banco'});
            }
            if (results.length == 0) {
                return res.status(400).json({message: 'Time não encontrado'});
            }
            return res.json(results.rows[0]);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro');
    }
})

app.get('/api/partidas/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const partida = (await client.query(`SELECT * from Partida WHERE id = '${id}'`)).rows[0];
        const cartoes = (await client.query(`SELECT * from Cartao WHERE partida_id = '${id}'`)).rows;
        const estatisticas = (await client.query(`SELECT * from Estatistica WHERE partida_id = '${id}'`)).rows;
        const gols = (await client.query(`SELECT * from Gol WHERE partida_id = '${id}'`)).rows;
        const subs = (await client.query(`SELECT * from Substituicao WHERE partida_id = '${id}'`)).rows;
    
        res.json({partida, cartoes, estatisticas, gols, subs})
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro');
    }
})

app.get('/api/partidas', async (req, res) => {
    try {
        const result = await client.query('SELECT * from Partida order by data desc');
        res.json(result.rows);
    } catch (err) {
        console.error(error);
        res.status(500).send('Erro');
    }
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
