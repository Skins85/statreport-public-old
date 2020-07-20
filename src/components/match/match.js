import React, { useEffect, useState } from "react";

import Moment from 'react-moment';
import Results from '../../page-layouts/results/results';

export default function Matches() {
    const [hasError, setErrors] = useState(false);
    const [data, setData] = useState({});
    const [playerData, setPlayerData] = useState({});

    useEffect(() => {
    async function fetchData() {
        const res = await fetch("/get-results");
        res
            .json()
            .then(res => setData(res))
            .catch(err => setErrors(err));
        const players = await fetch("/get-players");
        players
            .json()
            .then(players => setPlayerData(players))
            .catch(err => setErrors(err));
        }
        fetchData();
    },[]);


    let matches = data.results,
        players = playerData.results,
        search = window.location.search,
        params = new URLSearchParams(search),
        matchId = params.get('m'),
        filteredMatches,
        player_1,
        player_2,
        player_3,
        player_4,
        player_5,
        player_6,
        player_7,
        player_8,
        player_9,
        player_10,
        player_11,
        sub_1,
        sub_2,
        sub_3,
        sub_4,
        m;

    if (matches && matchId) {
        filteredMatches = matches.filter(function(match) {
            return (
                match.match_id === matchId
            )
        });
        m = filteredMatches[0];        

        if (players) {

            player_1 = players.filter((p) => p.Player === m.player_1 );
            player_1 = `${player_1[0].first_name} ${player_1[0].surname}`;

            player_2 = players.filter((p) => p.Player === m.player_2 );
            player_2 = `${player_2[0].first_name} ${player_2[0].surname}`;

            player_3 = players.filter((p) => p.Player === m.player_3 );
            player_3 = `${player_3[0].first_name} ${player_3[0].surname}`;

            player_4 = players.filter((p) => p.Player === m.player_4 );
            player_4 = `${player_4[0].first_name} ${player_4[0].surname}`;

            player_5 = players.filter((p) => p.Player === m.player_5 );
            player_5 = `${player_5[0].first_name} ${player_5[0].surname}`;

            player_6 = players.filter((p) => p.Player === m.player_6 );
            player_6 = `${player_6[0].first_name} ${player_6[0].surname}`;

            player_7 = players.filter((p) => p.Player === m.player_7 );
            player_7 = `${player_7[0].first_name} ${player_7[0].surname}`;

            player_8 = players.filter((p) => p.Player === m.player_8 );
            player_8 = `${player_8[0].first_name} ${player_8[0].surname}`;

            player_9 = players.filter((p) => p.Player === m.player_9 );
            player_9 = `${player_9[0].first_name} ${player_9[0].surname}`;

            player_10 = players.filter((p) => p.Player === m.player_10 );
            player_10 = `${player_10[0].first_name} ${player_10[0].surname}`;

            player_11 = players.filter((p) => p.Player === m.player_11 );
            player_11 = `${player_11[0].first_name} ${player_11[0].surname}`;

            if (m.sub_1) {
                sub_1 = players.filter((p) => p.Player === m.sub_1 );
                sub_1 = `${sub_1[0].first_name} ${sub_1[0].surname}`;
            }
            
            if (m.sub_2) {
                sub_2 = players.filter((p) => p.Player === m.sub_2 );
                sub_2 = `${sub_2[0].first_name} ${sub_2[0].surname}`;
            }
            
            if (m.sub_3) {
                sub_3 = players.filter((p) => p.Player === m.sub_3 );
                sub_3 = `${sub_3[0].first_name} ${sub_3[0].surname}`;
            }
            
            if (m.sub_4) {
                sub_4 = players.filter((p) => p.Player === m.sub_4 );
                sub_4 = `${sub_4[0].first_name} ${sub_4[0].surname}`;
            }
            
        }

        return(
            <React.Fragment>
                <div className='content__inpage'>
                    <h1>{m.team_home} {m.home_goals}-{m.away_goals} {m.team_away}</h1>
                    <p><Moment format="DD/MM/YYYY">{m.date}</Moment></p>
                    <p>
                        <span><strong>Competition:</strong> {m.competition}  </span>
                        <span><strong>Opponent step:</strong> {m.step_opponent}</span>
                    </p>
                    <h2>Starting XI</h2>
                    <p>
                        <a href={`../../players/${m.player_1}`}>{player_1}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.player_2}`}>{player_2}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.player_3}`}>{player_3}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.player_4}`}>{player_4}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.player_5}`}>{player_5}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.player_6}`}>{player_6}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.player_7}`}>{player_7}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.player_8}`}>{player_8}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.player_9}`}>{player_9}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.player_10}`}>{player_10}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.player_11}`}>{player_11}</a>
                    </p>
                    <h2>Subs</h2>
                    <p>
                        <a href={`../../players/${m.sub_1}`}>{sub_1}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.sub_2}`}>{sub_2}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.sub_3}`}>{sub_3}</a>
                    </p>
                    <p>
                        <a href={`../../players/${m.sub_4}`}>{sub_4}</a>
                    </p>
                    <p><strong>Attendance</strong> {m.attendance} ({m.attendance_away} away)</p>
                    <p><strong>League position</strong> {m.league_position}</p>
                    <p><strong>Referee</strong> {m.referee}</p>
                </div>
            </React.Fragment>
        )
    } else {
        return(
            <Results />
        )
    }
}