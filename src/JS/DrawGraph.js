import * as d3 from "d3";
export default function () {
	const dimensions = {
		height: 300,
		width: 300,
		radius: 150,
	};

	const cent = { x: dimensions.width / 2 + 5, y: dimensions.height / 2 };
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
		.sort((a, b) => b.cost - a.cost)
		.value((d) => d.cost);

	const arcPath = d3
		.arc()
		.outerRadius(dimensions.radius)
		.innerRadius(dimensions.radius / 2);
	const color = d3.scaleOrdinal(d3["schemeSet1"]);
	return function (data) {
		color.domain(data.map((e) => e.name));
		const paths = graph.selectAll("paths").data(pie(data));
		paths
			.exit()
			.transition()
			.duration(750)
			.attrTween("d", arcTweenExit)
			.remove();
		paths
			.attr("d", arcPath)
			.transition()
			.duration(750)
			.attrTween("d", arcTweenUpdate);
		paths
			.enter()
			.append("path")
			.classed("arc", true)
			.attr("d", arcPath)
			.attr("stroke", "#fff")
			.attr("stroke-width", 3)
			.each(function (d) {
				this._current = d;
			})
			.attr("fill", (d) => color(d.data.name))
			.transition()
			.duration(750)
			.attrTween("d", arcTweenEnter);
	};
}
const arcTweenEnter = (d) => {
	const i = d3.interpolate(d.endAngle, d.startAngle);
	return function (t) {
		d.startAngle = i(t);
		return arcPath(d);
	};
};
const arcTweenExit = (d) => {
	const i = d3.interpolate(d.startAngle, d.endAngle);
	return function (t) {
		d.startAngle = i(t);
		return arcPath(d);
	};
};
const arcTweenUpdate = (d) => {
	const i = d3.interpolate(this._current, d);
	this._current = i(1);
	return function (t) {
		return arcPath(i(t));
	};
};
