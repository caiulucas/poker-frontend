import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Flop } from "./components/Flop";
import { Hand } from "./components/Hand";
import { PlayersList } from "./components/PlayersList";
import { cards } from "./utils/cards";

type Card = keyof typeof cards;

interface Player {
	id: string;
	hand: Card[];
	chips: number;
}

function App() {
	const [socket, setSocket] = useState<WebSocket>();
	const [minBet, setMinBet] = useState(0);
	const [player, setPlayer] = useState<Player>();
	const [pot, setPot] = useState(0);
	const [currentPlayerId, setCurrentPlayerId] = useState("");
	const [hasStarted, setHasStarted] = useState(false);
	const [flop, setFlop] = useState<Card[]>([]);
	const [players, setPlayers] = useState<Player[]>([]);

	const handleStart = useCallback(() => {
		if (!socket) {
			return;
		}

		socket.send(
			JSON.stringify({
				type: "start-game",
			}),
		);
	}, [socket]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setSocket(new WebSocket("ws://192.168.0.177:8080"));

		return () => {
			if (socket) {
				socket.close();
			}
		};
	}, []);

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.onopen = () => {
			console.log("[open] Connection established!");
		};

		socket.onmessage = (e) => {
			const data = JSON.parse(e.data);

			switch (data.type) {
				case "add-player":
					setPlayer(data.player);
					setPlayers(data.players);
					break;
				case "update-players":
					setPlayers(data.players);
					break;
				case "start-game":
					setHasStarted(data.hasStarted);
					setCurrentPlayerId(data.currentPlayer._id);
					setMinBet(data.minBet);
					setFlop(data.flop);
					break;
				case "remove-player":
					setPlayers(data.players);
					break;
				case "check":
					setCurrentPlayerId(data.currentPlayer._id);
					setMinBet(data.minBet);
					setFlop(data.flop);
					break;
				case "winner":
					alert(
						`O jogador ${data.winner.winner._id} ganhou com um ${data.winner.type} o valor de ${data.winner.pot} fichas`,
					);
					setPlayers(data.players);
					if (player) {
						setPlayer(
							data.winner.winner._id === player.id
								? { ...player, chips: data.winner.pot + player?.chips }
								: player,
						);
					}
					setHasStarted(data.hasStarted);
					setMinBet(data.minBet);
					setPot(0);
					setFlop(data.flop);
					break;
				case "bet":
					setCurrentPlayerId(data.currentPlayer._id);
					setPlayer(data.player.id === player?.id ? data.player : player);
					setMinBet(data.minBet);
					setPot(data.pot);
					setFlop(data.flop);
					break;
				case "fold":
					setPlayers(data.players);
					setMinBet(data.minBet);
					setFlop(data.flop);
					break;
				default:
					console.log("Invalid option");
			}
		};
	}, [socket, player]);

	useEffect(() => {
		const handleBeforeUnload = () => {
			if (socket) {
				socket.close();
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [socket]);

	return (
		<>
			<main className="bg-green-700 h-screen w-screen">
				{players.length > 0 && (
					<PlayersList
						players={players}
						currentPlayer={currentPlayerId}
						playerId={player?.id}
					/>
				)}
				<div className="w-full h-full flex flex-col justify-center items-center gap-y-16">
					{hasStarted ? (
						<>{!!flop && <Flop flop={flop} pot={pot} />}</>
					) : (
						<button
							type="button"
							onClick={handleStart}
							className="bg-orange-500"
						>
							<strong>Começar</strong>
						</button>
					)}
					{!!player && !!socket && (
						<Hand
							hand={player.hand}
							minBet={minBet}
							currentPlayerId={currentPlayerId}
							playerId={player.id}
							socket={socket}
							chips={player.chips}
						/>
					)}
				</div>
			</main>
		</>
	);
}

export default App;
