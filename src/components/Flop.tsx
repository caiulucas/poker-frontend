import { useEffect, useRef, useState } from "react";
import flipMp3 from "../assets/flip.mp3";
import { Card, cards } from "../utils/cards";

interface FlopProps {
	flop: Card[];
	pot: number;
}

export function Flop({ flop, pot }: FlopProps) {
	const flipAudioRef = useRef<HTMLAudioElement | null>(null);

	const [flopLength, setFlopLength] = useState(flop.length);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (flopLength < flop.length) {
			flipAudioRef.current?.play();
			setFlopLength(flop.length);
		}
	}, [flop]);

	return (
		<div>
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<audio className="invisible" src={flipMp3} ref={flipAudioRef} />

			<div className="flex gap-2 h-72">
				{flop.map((card) => (
					<img key={card} src={cards[card]} alt={card} />
				))}
			</div>
			<p>Pot: {pot}</p>
		</div>
	);
}
