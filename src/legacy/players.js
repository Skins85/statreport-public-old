import React, {Component} from 'react';

import Debut from '../../components/player/debut';
import Player from '../../components/player/player';

class Players extends Component {
	constructor(props) {
		super(props);
		this.state = {
			allPlayersData: '',
			startsData: '',
			subsData: '',
			goalsData: '',
			playerSelected: false
		};
	};

  	componentDidMount() {

		let final_string = window.location.pathname.split("/").pop();
		
		// If no player has been selected, fetch all player data
		if (final_string === 'players') {
			console.log('all players data');
			fetch(`/get-players`)
				.then(response => response.json())
				.then(allPlayersData => this.setState({allPlayersData}));
		// Fetch specific player data
		} else {
			this.setState({
				playerSelected: true
			});
			console.log('specific player data');
			fetch(`/get-players-starts/${this.props.match.params.playerid}`)
				.then(response => response.json())
				.then(startsData => this.setState({startsData}));

			fetch(`/get-players-subs/${this.props.match.params.playerid}`)
				.then(response => response.json())
				.then(subsData => this.setState({subsData}));

			fetch(`/get-players-goals/${this.props.match.params.playerid}`)
				.then(response => response.json())
				.then(goalsData => this.setState({goalsData}));
		}
    
    }
        
  	render() {

		let allPlayersData = this.state.allPlayersData.results,
			startsData = this.state.startsData.results,
			subsData = this.state.subsData.results,
			goalsData = this.state.goalsData.results,
			starts = 0,
			subs = 0,
			startsBySeasonArray = [],
			subsBySeasonArray = [],
			goalsBySeasonArray = [],
			season_template,
			totalApps,
			totalGoals,
			first_name = [],
			full_name,
			surname = [],
			player_template,
			first_start_date,
			first_sub_date,
			debut_date,
			debut_game,
			debut_team_home,
			debut_team_away,
			debut_home_goals,
			debut_away_goals;
		
		// Player-specific output
		if (this.state.playerSelected) {

			// Number of starts / substitutes (total)
			if (this.state.startsData) {
				starts = this.state.startsData.results.length;
				first_start_date = this.state.startsData.results[0].date;	
			}
			if (this.state.subsData) {
				subs = this.state.subsData.results.length;
				// first_sub_date = this.state.subsData.results[0].date;
			}
			totalApps = starts + subs;

			// Debut date: check what is earliest (first start or first sub appearance)
			first_start_date > first_sub_date ? debut_date = first_sub_date : debut_date = first_start_date;

			// Name template
			if (startsData) {
				startsData.map(s => { first_name.push(s.first_name) });
				startsData.map(s => { surname.push(s.surname) });
				
				// Convert data to array of objects
				let startsDataArray = new Array(startsData);

				// Target object matching debut date (if it exists)
				debut_game = startsDataArray[0].find(obj => obj.date == debut_date);
								
			}
			if (subsData) {
				subsData.map(s => { first_name.push(s.first_name) });
				subsData.map(s => { surname.push(s.surname) });

				// Convert data to array of objects
				let subsDataArray = new Array(subsData);

				// Target object matching debut date (if it exists)
				if (!debut_game) {
					debut_game = subsDataArray[0].find(obj => obj.date == debut_date);
				}

			}

			for (const a in debut_game) {
				debut_team_home = debut_game['team_home'];
				debut_team_away = debut_game['team_away'];
				debut_home_goals = debut_game['home_goals'];
				debut_away_goals = debut_game['away_goals'];
			}
		
			first_name = first_name[0];
			surname = surname[0];
			full_name = `${first_name} ${surname}`;

			// Make season values accessible
			for (const r in startsData) {
				startsBySeasonArray.push(startsData[r].season);
			}
			for (const r in subsData) {
				subsBySeasonArray.push(subsData[r].season);
			}
			for (const r in goalsData) {
				goalsBySeasonArray.push(goalsData[r].season);
			}

			let startsObj = {};
			let subsObj = {};
			let goalsObj = {};

			let countStartsFunc = keys => {
				startsObj[keys] = ++startsObj[keys] || 1;
			}
			let countSubsFunc = keys => {
				subsObj[keys] = ++subsObj[keys] || 1;
			}
			let countGoalsFunc = keys => {
				goalsObj[keys] = ++goalsObj[keys] || 1;
			}

			startsBySeasonArray.forEach(countStartsFunc);
			subsBySeasonArray.forEach(countSubsFunc);
			goalsBySeasonArray.forEach(countGoalsFunc);
			totalGoals = goalsBySeasonArray.length;

			// Create a combined object so template works if one season has 0 starts or subs
			let totalObj = {...startsObj, ...subsObj, ...goalsObj};
			
			season_template = Object.keys(totalObj).map(key => 
			<tr key={key}>
				<td>{key}</td>
				{startsObj[key] ? <td>{startsObj[key]}</td> : <td>{startsObj[key] = 0}</td>}
				{subsObj[key] ? <td>{subsObj[key]}</td> : <td>{subsObj[key] = 0}</td>}
				{totalObj[key] > 0  ? <td>{startsObj[key] + subsObj[key]}</td>  : <td>{totalObj[key] = 0}</td>}
				{goalsObj[key] ? <td>{goalsObj[key]}</td> : <td>{goalsObj[key] = 0}</td>}
			</tr>
			)
			
			return (
				<div>
				<h3>ID: {this.props.match.params.playerid}</h3>
					<Player 
						name={full_name} 
						starts={starts}
						subs={subs}
						total={totalApps}
						first_start_date={first_start_date}
						first_sub_date={first_sub_date}
						debut_date={debut_date}
					/>
					<Debut
						team_home={debut_team_home}
						home_goals={debut_home_goals}
						team_away={debut_team_away}
						away_goals={debut_away_goals}
					/>
					<table>
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
						{season_template}
						<tr>
						<td>Total</td>
						<td>{starts}</td>
						<td>{subs}</td>
						<td>{totalApps}</td>
						<td>{totalGoals}</td>
						</tr>
					</tbody>
					</table>
				</div>
			)
		} 
		// All players data
		else {
			if (allPlayersData) {
				player_template = allPlayersData.map((item) =>
					<div key={item.Player}>
						<p key={item.Player}>
							<a href={`players/${item.Player}`}>{item.first_name} {item.surname}</a> 
							{item.count}	
						</p>
						<p>
							{goalsData} 
						</p>
					</div>
					
				);
			}	
			return (
				<div>
					<h1>Players</h1>
					{player_template}
				</div>
			)	
		}
	}    
}

export default Players;