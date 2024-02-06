import { useCallback, useState } from "react";
import flipMp3 from "../assets/flip.mp3";
import { cards } from "../utils/cards";

type Card = keyof typeof cards;

interface HandProps {
	hand: Card[];
	currentPlayerId: string;
	playerId: string;
	chips: number;
	socket: WebSocket;
	minBet: number;
}

export function Hand({
	hand,
	playerId,
	currentPlayerId,
	socket,
	chips,
	minBet,
}: HandProps) {
	const [bet, setBet] = useState(minBet);

	const handleCheck = useCallback(() => {
		socket.send(
			JSON.stringify({
				type: "check",
				playerId: playerId,
			}),
		);
	}, [socket, playerId]);

	const handleBet = useCallback(() => {
		socket.send(
			JSON.stringify({
				type: "bet",
				playerId: playerId,
				value: bet,
			}),
		);
	}, [socket, playerId, bet]);

	const handleFold = useCallback(() => {
		socket.send(
			JSON.stringify({
				type: "fold",
				playerId: playerId,
			}),
		);
	}, [socket, playerId]);

	return (
		<div>
			<audio className= src={flipMp3} />
			<div className="flex gap-2 h-72">
				{hand.map((card) => (
					<img
						key={card}
						src={cards[card]}
						alt={card}
						height={288}
						className="object-contain w-52"
					/>
				))}
			</div>
			<div className="flex gap-2 mt-3">
				<button
					onClick={handleCheck}
					disabled={playerId !== currentPlayerId || minBet === 0}
					type="button"
					className={`flex-1 ${
						playerId !== currentPlayerId || minBet === 0
							? "bg-orange-700"
							: "bg-orange-500"
					}`}
				>
					<strong>Check</strong>
				</button>
				<input
					type="number"
					name="bet"
					id="bet"
					min={minBet}
					max={chips}
					value={bet}
					onChange={(e) => setBet(Number(e.target.value))}
				/>
				<button
					disabled={playerId !== currentPlayerId || minBet > chips}
					type="button"
					onClick={handleBet}
					className={`flex-1 ${
						playerId !== currentPlayerId ? "bg-orange-700" : "bg-orange-500"
					}`}
				>
					<strong>Bet</strong>
				</button>
				<button
					onClick={handleFold}
					disabled={playerId !== currentPlayerId}
					type="button"
					className={`flex-1 ${
						playerId !== currentPlayerId ? "bg-orange-700" : "bg-orange-500"
					}`}
				>
					<strong>Fold</strong>
				</button>
			</div>
			<p>Suas fichas: {chips}</p>
		</div>
	);
}
