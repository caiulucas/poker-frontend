import { Card, cards } from "../utils/cards";

interface FlopProps {
	flop: Card[];
	pot: number;
}

export function Flop({ flop, pot }: FlopProps) {
	return (
		<div>
			<div className="flex gap-2 h-72">
				{flop.map((card) => (
					<img key={card} src={cards[card]} alt={card} />
				))}
			</div>
			<p>Pot: {pot}</p>
		</div>
	);
}
