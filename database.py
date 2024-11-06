import requests
import psycopg2

BASE_URL = 'https://apiv3.apifootball.com/'
API_KEY = '4190df28c8a2a38952da0d784ba43e86d7e1c1ca54560544c3786a88b867e0cf'
league_id = 99

conn = psycopg2.connect(
    dbname="futebol",
    user="postgres",
    password="postgres",
    host="localhost",
    port="5432" 
)

def get_teams():
    teams = requests.get(f'{BASE_URL}?action=get_teams&league_id=99&APIkey={API_KEY}').json()
    for team in teams:
        cur.execute(
            f"INSERT INTO Time(id, nome, escudo) VALUES ('{team['team_key']}', '{team['team_name']}', '{team['team_badge']}')"
        )
        cur.execute(
            f"INSERT INTO Estadio(nome, cidade) VALUES ('{team['venue']['venue_name']}', '{team['venue']['venue_city']}')"
        )
        for player in team['players']:
            cur.execute(
                f"""INSERT INTO Jogador VALUES (
                        '{player['player_id']}',
                        '{player['player_image']}',
                        '{team['team_key']}',
                        '{player['player_name'].replace("'", "")}',
                        '{player['player_type']}',
                        '{player['player_age']}',
                        '{player['player_goals']}',
                        '{player['player_match_played']}',
                        '{player['player_yellow_cards']}',
                        '{player['player_red_cards']}',
                        '{player['player_shots_total']}',
                        '{player['player_fouls_committed']}',
                        '{player['player_passes']}'
                    )
                """
            )

def get_matches(inicial_date, final_date):
    matches = requests.get(f'{BASE_URL}?action=get_events&from={inicial_date}&to={final_date}&league_id=99&APIkey={API_KEY}').json()
    for match in matches:
        cur.execute(
                f"""INSERT INTO Partida VALUES (
                        '{match['match_id']}',
                        '{match['match_date']}',
                        '{match['match_stadium']}',
                        '{match['match_hometeam_id']}',
                        '{match['match_awayteam_id']}',
                        '{match['match_hometeam_score'] or 0}',
                        '{match['match_awayteam_score'] or 0}',
                        '{match['match_referee']}'
                    )
                """
            )
        for goal in match['goalscorer']:
            if goal['home_scorer_id'] != goal['away_scorer_id']:
                id = goal['home_scorer_id'] if goal['home_scorer_id'] != '' else goal['away_scorer_id']
                if check_exists(id):
                    cur.execute(
                        "INSERT INTO Gol(tempo, gol_casa, gol_visitante, partida_id) VALUES (%s, %s, %s, %s)",
                            (goal['time'],
                            goal['home_scorer_id'] or None,
                            goal['away_scorer_id'] or None,
                            match['match_id'])
                            )


        for sub in match['substitutions']['away']:
            cur.execute(
                f"""INSERT INTO Substituicao(partida_id, time_id, minuto, substituicao) VALUES (
                        '{match['match_id']}',
                        '{match['match_awayteam_id']}',
                        '{sub['time']}',
                        '{sub['substitution']}'
                    )
                """
            )
        for sub in match['substitutions']['home']:
            cur.execute(
                f"""INSERT INTO Substituicao(partida_id, time_id, minuto, substituicao) VALUES (
                        '{match['match_id']}',
                        '{match['match_hometeam_id']}',
                        '{sub['time']}',
                        '{sub['substitution']}'
                    )
                """
            )
        for card in match['cards']:
            jogador_id = card['home_player_id'] if card['home_player_id'] != '' else card['away_player_id']
            if check_exists(jogador_id):
                tipo = 'Amarelo' if card['card'] == 'yellow card' else 'Vermelho'
                cur.execute(
                    f"""INSERT INTO Cartao(partida_id, jogador_id, tipo, minuto) VALUES (
                            '{match['match_id']}',
                            '{jogador_id}',
                            '{tipo}',
                            '{card['time']}'
                        )
                    """
                )

        for stat in match['statistics']:
            cur.execute(
                f"""INSERT INTO Estatistica(partida_id, tipo, casa, visitante) VALUES (
                        '{match['match_id']}',
                        '{stat['type']}',
                        '{stat['home']}',
                        '{stat['away']}'
                    )
                """
            )

def check_exists(id):
    cur.execute(f"SELECT * from Jogador where id = '{id}'")
    if cur.fetchall() == []:
        return False
    return True


cur = conn.cursor()
#get_teams()
get_matches('2024-10-22', '2024-10-25')
conn.commit()
cur.close()
conn.close()
