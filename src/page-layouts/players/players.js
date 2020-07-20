import React, {Component} from 'react';

import Banner from '../../components/banner/banner';
import Player from '../../components/player/player';
import PlayerResults from '../../components/player/player-results';
import {groupArrayOfObjects} from '../../util';

class Players extends Component {
	constructor(props) {
		super(props);
		this.state = {
            allData: '',
			playersData: '',
			startsData: '',
			subsData: '',
			goalsData: '',
			playerSelected: false,
            showMatches: false,
		};
	};

    showMatchesHandler = e => {
        this.setState(prevState => ({
            showMatches: !prevState.showMatches
        }));
        e.target.innerText === `Show all results` 
            ? e.target.innerText = `Hide all results`
            : e.target.innerText = `Show all results`;
    }

  	componentDidMount() {
        fetch(`/get-players`)
            .then(response => response.json())
            .then(response => response.results)
            .then(playersData => this.setState({playersData}));
        fetch(`/get-results`)
            .then(response => response.json())
            .then(response => response.results)
            .then(allData => this.setState({allData}));
        fetch(`/get-goals-all`)
            .then(response => response.json())
            .then(response => response.results)
            .then(goalsData => this.setState({goalsData}));
    }

    render() {
        let results = this.state.allData,
            goals = this.state.goalsData,
            players = this.state.playersData,
            showMatches = this.state.showMatches,
            playerId = window.location.pathname.split("/").pop(),
            filteredStarts,
            filteredSubs,
            filteredAllAppearances,
            filteredGoals,
            filteredPlayers,
            filteredStartsBySeason = [],
            filteredSubsBySeason = [],
            filteredGoalsBySeason = [],
            totalStarts,
            totalSubs,
            totalApps,
            totalGoals,
            startsObj = {},
            subsObj = {},
            goalsObj = {},
            seasonTemplate,
            playerResultsTemplate,
            playerResultsTableStart,
            indexTemplate,
            selectedPlayerName,
            firstStartDate,
            firstSubDate,
            debutDate,
            debutMatchInfo,
            debutTeamHome,
            debutTeamAway,
            debutGoalsHome,
            debutGoalsAway,
            debutMatchId;

        let banner = <Banner
            name='Players'
            description='Appearances and goal data'
            image='/images/banner/football-field-alfredo-camacho.jpg'
            // Banner image: Photo by <a href="/photographer/alfcb-46394">Alfredo Camacho</a> from <a href="https://freeimages.com/">FreeImages</a>
        />

        if (results && goals && (!['players','scorers',].includes(playerId))) {
            filteredStarts = results.filter(function(result) {
                return (
                    result.player_1 === playerId ||
                    result.player_2 === playerId ||
                    result.player_3 === playerId ||
                    result.player_4 === playerId ||
                    result.player_5 === playerId ||
                    result.player_6 === playerId ||
                    result.player_7 === playerId ||
                    result.player_8 === playerId ||
                    result.player_9 === playerId ||
                    result.player_10 === playerId ||
                    result.player_11 === playerId
                )
            });
            filteredSubs = results.filter(function(result) {
                return (
                    result.sub_1 === playerId ||
                    result.sub_2 === playerId ||
                    result.sub_3 === playerId ||
                    result.sub_4 === playerId ||
                    result.sub_5 === playerId
                )
            });
            filteredGoals = goals.filter(function(result) {
                return (
                    result.scorer_id === playerId
                )
            });
            filteredPlayers = players.filter(function(result) {
                return (
                    result.Player === playerId
                )
            });
            selectedPlayerName = `${filteredPlayers[0].first_name} ${filteredPlayers[0].surname}`;

            // Get debut date and associated match information
            if (filteredStarts.length > 0) {
                firstStartDate = filteredStarts.sort(function(a, b){ 
                    return new Date(a.date) - new Date(b.date); 
                });
                firstStartDate = firstStartDate[0].date;
            }
            if (filteredSubs.length > 0) {
                firstSubDate = filteredSubs.sort(function(a, b){ 
                    return new Date(a.date) - new Date(b.date); 
                });
                firstSubDate = firstSubDate[0].date;
            }
            firstStartDate < firstSubDate || !firstSubDate ? debutDate = firstStartDate : debutDate = firstSubDate;
            debutMatchInfo = results.filter(function(result) {
                return (
                    result.date === debutDate
                )
            });
            debutTeamHome = debutMatchInfo[0].team_home;
            debutTeamAway = debutMatchInfo[0].team_away;
            debutGoalsHome = debutMatchInfo[0].home_goals;
            debutGoalsAway = debutMatchInfo[0].away_goals;
            debutMatchId = debutMatchInfo[0].match_id;

            // Push all season values to array
            for (const r in filteredStarts) {
				filteredStartsBySeason.push(filteredStarts[r].season);
			}
            for (const r in filteredSubs) {
				filteredSubsBySeason.push(filteredSubs[r].season);
			}
            for (const r in filteredGoals) {
				filteredGoalsBySeason.push(filteredGoals[r].season);
			}
            
            // Calculate how many instances of each season exist
            let countStarts = keys => { startsObj[keys] = ++startsObj[keys] || 1; }
            let countSubs = keys => { subsObj[keys] = ++subsObj[keys] || 1; }
			let countGoals = keys => { goalsObj[keys] = ++goalsObj[keys] || 1; };

            // Run this on each data set
            filteredStartsBySeason.forEach(countStarts);
            filteredSubsBySeason.forEach(countSubs);
            filteredGoalsBySeason.forEach(countGoals);

            // Create a combined object so template works if one season has 0 starts or subs
			let totalObj = {...startsObj, ...subsObj, ...goalsObj};

            // Assign total values for starts/subs/goals
            totalStarts = filteredStartsBySeason.length;
            totalSubs = filteredSubsBySeason.length;
            totalApps = totalStarts + totalSubs;
            totalGoals = filteredGoalsBySeason.length;

            seasonTemplate = Object.keys(totalObj).map(key => 
                <tr key={key}>
                    <td data-type='num'>{key}</td>
                    {startsObj[key] ? <td data-type='num'>{startsObj[key]}</td> : <td data-type='num'>{startsObj[key] = 0}</td>}
                    {subsObj[key] ? <td data-type='num'>{subsObj[key]}</td> : <td data-type='num'>{subsObj[key] = 0}</td>}
                    {totalObj[key] > 0  ? <td data-type='num'>{startsObj[key] + subsObj[key]}</td>  : <td data-type='num'>{totalObj[key] = 0}</td>}
                    {goalsObj[key] ? <td data-type='num'>{goalsObj[key]}</td> : <td data-type='num'>{goalsObj[key] = 0}</td>}
                </tr>
            )

            filteredAllAppearances = filteredStarts.concat(filteredSubs);

            let arrayOfSeasonsObj = groupArrayOfObjects(filteredAllAppearances, 'season');
            let seasonObj = Object.entries(arrayOfSeasonsObj);
            let string;
            let season;
            for (const i of seasonObj) {
                season = i[0];
                let seasonData = i[1];
                for (const e of seasonData) {
                    string = seasonData.map(key =>
                        <p>{key.match_id}</p>
                    )
                }
            }

            if (showMatches) {
                playerResultsTableStart = 
                <thead data-content-align='left'>
                    <tr>
                        <th>Date</th>
                        <th>Season</th>
                        <th>Home</th>
                        <th></th>
                        <th>Away</th>
                    </tr>
                </thead>;
                filteredAllAppearances.sort((a, b) => (a.date < b.date) ? 1 : -1)
                playerResultsTemplate = filteredAllAppearances.map(key => 
                    <PlayerResults
                        date={key.date}
                        season={key.season}
                        match_id={key.match_id}
                        team_home={key.team_home}
                        team_away={key.team_away}
                        home_goals={key.home_goals}
                        away_goals={key.away_goals}
                    />
                )
            }
            
            return (
                <React.Fragment>
                    <Banner
                        image='/images/banner/football-field-alfredo-camacho.jpg'
                        // Banner image: Photo by <a href="/photographer/alfcb-46394">Alfredo Camacho</a> from <a href="https://freeimages.com/">FreeImages</a>
                    />
                    <div className='content__inpage'>
                        <Player 
                            name={selectedPlayerName} 
                            debut_date={debutDate}
                            debut_team_home={debutTeamHome}
                            debut_team_away={debutTeamAway}
                            debut_goals_home={debutGoalsHome}
                            debut_goals_away={debutGoalsAway}
                            debut_match_id={debutMatchId}
                        />
                        <table className='width--50'>
                            <thead>
                                <tr>
                                    <th>Season</th>
                                    <th>Starts</th>
                                    <th>Subs</th>
                                    <th>Total</th>
                                    <th>Goals</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seasonTemplate}
                                <tr>
                                    <td data-type='num'>Total</td>
                                    <td data-type='num'>{totalStarts}</td>
                                    <td data-type='num'>{totalSubs}</td>
                                    <td data-type='num'>{totalApps}</td>
                                    <td data-type='num'>{totalGoals}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p>
                            <button href="#" onClick={this.showMatchesHandler.bind(this)}>
                                Show all results
                            </button>
                        </p>
                        {this.state.showMatches ? <h3>All {selectedPlayerName} appearances</h3> : null }
                        <table>
                            {playerResultsTableStart}
                            {playerResultsTemplate}
                        </table>
                    </div>
                </React.Fragment>
            )
        } else {
            if (players) {
                indexTemplate = players.map(p => 
                    <p key={`${p.Player}`}>
                        {p.count} <a href={`../players/${p.Player}`}>{p.first_name} {p.surname}</a>
                    </p>
                )
            }
            return (
                <React.Fragment>
                    <Banner
                        name='Players'
                        description='Appearances and goal data'
                        image='/images/banner/football-field-alfredo-camacho.jpg'
                        // Banner image: Photo by <a href="/photographer/alfcb-46394">Alfredo Camacho</a> from <a href="https://freeimages.com/">FreeImages</a>
                    />
                    <div className='content__inpage'>
                        <p>Dagenham & Redbridge players ordered by number of appearances.</p>
                        {indexTemplate}
                    </div>
                </React.Fragment>
            )
        }
    }
}

export default Players;