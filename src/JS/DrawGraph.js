import * as d3 from "d3";
import $ from "jquery";
import legendPlugin from "d3-svg-legend";
import tipPlugin from "d3-tip";
import Error from "./Error";

import { db } from "./Firebase";
let sizeValue = 1;
const legendLimit = 6;
function mapValueToSize() {
	return d3.scaleLinear().domain([1310, 360]).range([1, 0.6]);
}
function getSizeOfPie() {
	const win = $(window);

	if (win.width() <= 1310) {
		sizeValue = mapValueToSize()(win.width());
	}
}
getSizeOfPie();
export default function () {
	const dimensions = {
		height: 300 * 0.5,
		width: 300 * sizeValue,
		radius: 150 * sizeValue,
	};

	const cent = {
		x: dimensions.width / 2,
		y: dimensions.height / 2 + (300 - 300 * 0.5) / 2,
	};
	const svg = d3
		.select(".canvas")
		.append("svg")
		.attr("width", dimensions.width + 150)
		.attr("height", dimensions.height + 150)
		.attr("transform", `translate(${80 / 4}, ${0})`);

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
	let translate;
	if (dimensions.width >= 210) {
		translate = dimensions.width + 40;
	} else {
		translate = dimensions.width / sizeValue - 40;
	}
	const legendGroup = svg
		.append("g")
		.attr("transform", `translate(${translate}, 5)`);
	const legend = legendPlugin
		.legendColor()
		.shape("square")
		.shapePadding(10)
		.scale(color);
	console.log(legendGroup.selectAll("text"));
	const tip = tipPlugin()
		.attr("class", "tip card")
		.html((d) => {
			let content = `<div class="name">${d.data.name}</div>`;
			content += `<div class="type">${d.data.type}</div>`;
			content += `<div class="cost">${d.data.cost}</div>`;
			content += `<div class="delete">Double click slice to delete</div>`;
			return content;
		});
	graph.call(tip);
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
		graph.selectAll("path").on("dblclick", handleDoubleClick);
		graph.selectAll("path").on("click", handleClick);
		limitLegends();
	};
	function handleClick(d) {
		const currentEl = $(`[data-id="${d.data.id}"]`);
		currentEl.addClass("full");
		setTimeout(() => currentEl.removeClass("full"), 500);
		$("html,body").animate(
			{
				scrollTop: currentEl.offset().top,
			},
			"slow"
		);
	}
	function onMouseOver(d, n, i) {
		tip.show(d, this);
		d3.select(this)
			.transition("changeSliceFill")
			.duration(300)
			.attr("fill", "#fff");
		d3.select(`[data-element="${d.data.name}"]`).classed(
			"active-item",
			true
		);
	}
	function onMouseLeave(d) {
		tip.hide();
		d3.select(this)
			.transition("changeSliceFill")
			.duration(300)
			.attr("fill", color(d.data.name));
		d3.select(`[data-element="${d.data.name}"]`).classed(
			"active-item",
			false
		);
	}
	function handleDoubleClick(d) {
		tip.hide();
		db.collection(d.data.uid).doc(d.data.id).delete().catch(Error);
	}
	function limitLegends() {
		const legends = d3.select(".legendCells").selectAll(".cell");
		const currentLength = legends.nodes().length;
		if (currentLength < legendLimit) {
			legends.each((d, i, n) => {
				if (i + 1 >= legendLimit) {
					n[i].remove();
				}
			});
		}
	}
}
