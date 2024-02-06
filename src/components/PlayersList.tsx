interface PlayersListProps {
	players: {
		id: string;
	}[];
	currentPlayer: string;
	playerId?: string;
}

export function PlayersList({
	players,
	currentPlayer,
	playerId,
}: PlayersListProps) {
	return (
		<ul className="absolute bg-green-800">
			{players.map((player) => (
				<li key={player.id} className="flex">
					{playerId === player.id ? (
						<p className="text-teal-500">{player.id}</p>
					) : (
						<p>{player.id}</p>
					)}
					{currentPlayer === player.id && (
						<span className="text-teal-400 mx-4">
							<strong>!!</strong>
						</span>
					)}
				</li>
			))}
		</ul>
	);
}
