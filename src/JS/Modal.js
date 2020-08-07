import $ from "jquery";
import { capitalize, hideElement, showElement } from "./utils";
import { auth } from "./Firebase";
import { validatePass } from "./Form";
import { showBoard } from "./MessageBoard";
export default function () {
	handleSlides();
	handlePasswords();
	formSubmit();
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
				top: "40%",
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
	$("#sign-up-password").keyup(function () {
		if (!validatePass($(this).val())) {
			$(this).removeClass("valid");
			$(this).addClass("invalid");
		} else {
			$(this).removeClass("invalid");

			$(this).addClass("valid");
		}
	});
	$("#sign-up-password").focusout(function () {
		if (!validatePass($(this).val())) {
			$(this).removeClass("valid");

			$(this).addClass("invalid");
			console.log($(this));
		} else {
			$(this).removeClass("invalid");

			$(this).addClass("valid");
		}
	});
}
function formSubmit() {
	$("#sign-in").submit(function (e) {
		e.preventDefault();
	});
	$("#sign-up").submit(function (e) {
		e.preventDefault();
		const values = [];
		$(e.target)
			.find("input")
			.each(function () {
				values.push($(this).val());
			});
		const [firstName, lastName, email, password] = values;
		if (validatePass(password)) {
			addUser({ firstName, lastName, email, password });
		}
	});
}

function addUser(userInfo) {
	startGeneratingAccount();
	const { email, password, firstName, lastName } = userInfo;
	auth.createUserWithEmailAndPassword(email, password)
		.then((e) => {
			e.user
				.updateProfile({
					displayName: `${firstName} ${lastName}`,
				})
				.then((e) => {
					showBoard("success", firstName);
					accountResponse();
				});
		})
		.catch((e) => {
			if (e.code === "auth/email-already-in-use") {
				$("#sign-up-email").removeClass("valid").addClass("invalid");
				const helper = $("#sign-up-email")
					.parent()
					.find(".helper-text");
				helper.attr("data-error", "Email already in use");
				setTimeout(() => {
					helper.attr("data-error", "Email is invalid");
				}, 2000);
			} else {
				showBoard("error", e.code);
				accountResponse();
			}
		});
}
hideElement($(".loader"));
function startGeneratingAccount() {
	hideElement($("#sign-up-btn"));
	showElement($(".loader"), "flex");
}
function accountResponse(success = true) {
	showElement($("#sign-up-btn"));
	hideElement($(".loader"));
	$("#sign-up").trigger("reset");
}
