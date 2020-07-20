import React, {Component} from 'react';

import PlayerNew from '../../components/player/player-new';

class PlayersNew extends Component {
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

  	// componentDidMount() {

	// 	console.log('component mount');
	// 	let final_string = window.location.pathname.split("/").pop();
		
	// 	// If no player has been selected, fetch all player data
	// 	if (final_string === 'players') {
	// 		console.log('all players data');
	// 		fetch(`/get-players`)
	// 			.then(response => response.json())
	// 			.then(allPlayersData => this.setState({allPlayersData}));
	// 	// Fetch specific player data
	// 	} else {
	// 		this.setState({
	// 			playerSelected: true
	// 		});
	// 		console.log('specific player data');
	// 		// fetch(`/get-players-starts/${this.props.match.params.playerid}`)
	// 		// 	.then(response => response.json())
	// 		// 	.then(startsData => this.setState({startsData}));

	// 		fetch(`/get-players-subs/${this.props.match.params.playerid}`)
	// 			.then(response => response.json())
	// 			.then(subsData => this.setState({subsData}));

	// 		fetch(`/get-players-goals/${this.props.match.params.playerid}`)
	// 			.then(response => response.json())
	// 			.then(goalsData => this.setState({goalsData}));
	// 	}
    // }

    render() {
        return (
            <div>
                <h1>Players index (new)</h1>
                <PlayerNew />
            </div>
        )
    }
}

export default PlayersNew;