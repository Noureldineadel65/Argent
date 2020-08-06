import $ from "jquery";
import { capitalize } from "./utils";
export default function () {
	handleSlides();
	handlePasswords();
}
function handleSlides() {
	const signUpWith = $(".signUpWith");
	$(".already").on("click", function (e) {
		let state = "CREATE";
		if (e.target.getAttribute("id") === "switch-right") {
			state = "SIGN-IN";
			signUpWith.addClass("slided");
		} else {
			signUpWith.removeClass("slided");
			state = "CREATE";
		}
		$("#state").text(state);

		$(".state-social").text(capitalize(state.toLowerCase()));
	});
}
function handlePasswords() {
	$(`input[type="password"]`).each(function () {
		$(this).parent().css("position", "relative");
		$("<span/>", {
			class: "material-icons",
			css: {
				position: "absolute",
				right: "5%",
				top: "50%",
				transform: "translateY(-100%)",
				cursor: "pointer",
				color: "#ff5722",
			},
			text: "visibility",
			click: (e) => {
				const current = $(e.target);
				const currentText = current.text();

				if (currentText === "visibility") {
					showInputValue($(this));
					current.text("visibility_off");
				} else {
					hideInputValue($(this));
					current.text("visibility");
				}
			},
		}).appendTo($(this).parent());
	});
	function showInputValue(input) {
		input.attr("type", "text");
	}
	function hideInputValue(input) {
		input.attr("type", "password");
	}
}
