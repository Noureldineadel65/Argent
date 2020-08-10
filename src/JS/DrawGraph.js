import * as d3 from "d3";
import legendPlugin from "d3-svg-legend";
import { db } from "./Firebase";

export default function () {
	const dimensions = {
		height: 300,
		width: 300,
		radius: 150,
	};

	const cent = { x: dimensions.width / 2 + 5, y: dimensions.height / 2 + 20 };
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

	const arcPath = d3
		.arc()
		.outerRadius(dimensions.radius)
		.innerRadius(dimensions.radius / 2);
	const color = d3.scaleOrdinal(d3["schemeSet1"]);
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
	const arcTweenUpdate = function (d) {
		const i = d3.interpolate(this._current, d);
		this._current = i(1);
		return function (t) {
			return arcPath(i(t));
		};
	};
	const legendGroup = svg
		.append("g")
		.attr("transform", `translate(${dimensions.width + 40}, 10)`);
	const legend = legendPlugin
		.legendColor()
		.shape("square")
		.shapePadding(10)
		.scale(color);
	return function (data) {
		color.domain(data.map((e) => e.name));
		legendGroup.call(legend);
		const paths = graph.selectAll("path").data(pie(data));
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
			.attr("stroke", "#fff")
			.attr("stroke-width", 3)
			.attr("fill", (d) => color(d.data.name))

			.each(function (d) {
				this._current = d;
			})

			.transition()
			.duration(750)
			.attrTween("d", arcTweenEnter);
		graph.selectAll("path").on("mouseover", onMouseOver);
		graph.selectAll("path").on("mouseleave", onMouseLeave);
		graph.selectAll("path").on("click", handleClick);
	};
	function onMouseOver(d) {
		d3.select(this)
			.transition("changeSliceFill")
			.duration(300)
			.attr("fill", "#fff");
	}
	function onMouseLeave(d) {
		d3.select(this)
			.transition("changeSliceFill")
			.duration(300)
			.attr("fill", color(d.data.name));
	}
	function handleClick(d) {
		db.collection("expenses").doc(d.data.id).delete();
	}
}
