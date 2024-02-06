import { useCallback, useEffect, useRef, useState } from "react";
import checkMp3 from "../assets/check.mp3";
import chipsMp3 from "../assets/chips.mp3";
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
	const chipsAudioRef = useRef<HTMLAudioElement | null>(null);
	const checkAudioRef = useRef<HTMLAudioElement | null>(null);

	const [bet, setBet] = useState(minBet);

	const handleCheck = useCallback(() => {
		socket.send(
			JSON.stringify({
				type: "check",
				playerId: playerId,
			}),
		);

		checkAudioRef.current?.play();
	}, [socket, playerId]);

	const handleBet = useCallback(() => {
		socket.send(
			JSON.stringify({
				type: "bet",
				playerId: playerId,
				value: bet,
			}),
		);

		chipsAudioRef.current?.play();
	}, [socket, playerId, bet]);

	const handleFold = useCallback(() => {
		socket.send(
			JSON.stringify({
				type: "fold",
				playerId: playerId,
			}),
		);
	}, [socket, playerId]);

	const handleRaiseBet = useCallback(() => {
		setBet((state) => (state + 50 > chips ? state : state + 50));
	}, [chips]);

	const handleLowerBet = useCallback(() => {
		setBet((state) => (state - 50 < minBet ? state : state - 50));
	}, [minBet]);

	useEffect(() => {
		setBet(minBet);
	}, [minBet]);

	return (
		<div>
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio className="invisible" src={chipsMp3} ref={chipsAudioRef} />
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio className="invisible" src={checkMp3} ref={checkAudioRef} />
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
				<div className="flex gap-1">
					<input
						className="rounded-md p-1"
						type="number"
						name="bet"
						id="bet"
						disabled={true}
						min={minBet}
						max={chips}
						value={bet}
						onChange={(e) => setBet(Number(e.target.value))}
					/>
					<div className="flex gap-1">
						<button
							disabled={bet >= chips}
							className={`flex-1 ${
								bet >= chips ? "bg-orange-700" : "bg-orange-500"
							}`}
							type="button"
							onClick={handleRaiseBet}
						>
							+
						</button>
						<button
							disabled={bet <= minBet}
							className={`flex-1 ${
								bet <= minBet ? "bg-orange-700" : "bg-orange-500"
							}`}
							type="button"
							onClick={handleLowerBet}
						>
							-
						</button>
					</div>
				</div>
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
