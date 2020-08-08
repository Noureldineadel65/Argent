import * as d3 from "d3";
export default function () {
	const dimensions = {
		height: 300,
		width: 300,
		radius: 150,
	};

	const cent = { x: dimensions.width / 2 + 5, y: dimensions.height / 2 + 5 };
	const svg = d3
		.select(".canvas")
		.append("svg")
		.attr("width", dimensions.width + 150)
		.attr("height", dimensions.height + 150);
	const graph = svg
		.append("g")
		.attr("transform", `translate(${cent.x}, ${cent.y})`);
	const pie = d3
		.pie()
		.sort(null)
		.value((d) => d.cost);
	const angles = pie([
		{ name: "rent", cost: 500 },
		{ name: "bills", cost: 300 },
		{ name: "gaming", cost: 200 },
	]);
	const arcPath = d3
		.arc()
		.outerRadius(dimensions.radius)
		.innerRadius(dimensions.radius / 2);
}
