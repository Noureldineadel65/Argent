import $ from "jquery";
import { capitalize, hideElement, showElement, getFormValues } from "./utils";
import Error from "./Error";
import firebase from "firebase/app";
import { auth } from "./Firebase";
import { validatePass } from "./Form";
import { showBoard } from "./MessageBoard";
export default function () {
	handleSlides();
	handlePasswords();
	formSubmit();
	socialLogs();
	if ($(window).width() <= 801) {
		AutoScroll();
	}
}
const googleProvider = new firebase.auth.GoogleAuthProvider();
function handleSlides() {
	const signUpWith = $(".signUpWith");
	$(".already").on("click", function (e) {
		if (e.target.getAttribute("id") === "switch-right") {
			signUpWith.addClass("slided");
		} else {
			signUpWith.removeClass("slided");
		}
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
		} else {
			$(this).removeClass("invalid");

			$(this).addClass("valid");
		}
	});
}
function formSubmit() {
	$("#sign-in").submit(function (e) {
		startSigningIn();
		e.preventDefault();
		const [email, password] = getFormValues($(e.target));
		auth.signInWithEmailAndPassword(email, password)
			.then((cred) => {
				console.log("Successfully Signed In!");
				signInResponse();
			})
			.catch((e) => {
				if (
					e.code === "auth/wrong-password" ||
					e.code === "auth/user-not-found"
				) {
					$("#sign-in-password").addClass("invalid");
					$("#sign-in-password").focus(function () {
						$(this).removeClass("invalid");
					});
				} else {
					showBoard("error", e.message);
				}
				signInResponse();
			});
	});
	$("#sign-up").submit(function (e) {
		e.preventDefault();

		const [firstName, lastName, email, password] = getFormValues(
			$(e.target)
		);
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
					showBoard("success", `${firstName} ${lastName}`);
					signUpResponse();
				})
				.catch(Error);
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
				showBoard("error", e.message);
				signUpResponse();
			}
		});
}
hideElement($("#sign-up-action .loader"));
function startGeneratingAccount() {
	hideElement($("#sign-up-btn"));
	showElement($("#sign-up-action .loader"), "flex");
}
function startSigningIn() {
	hideElement($("#sign-in-btn"));
	showElement($("#sign-in-action .loader"), "flex");
}
function signInResponse() {
	showElement($("#sign-in-btn"));
	hideElement($("#sign-in-action .loader"));
	$("#sign-in").trigger("reset");
}
function signUpResponse() {
	showElement($("#sign-up-btn"));
	hideElement($("#sign-up-action .loader"));
	$("#sign-up").trigger("reset");
}
function socialLogs() {
	$(".google").on("click", function () {
		firebase.auth().signInWithPopup(googleProvider).catch(Error);
	});
}
function AutoScroll() {
	const animationTime = 300;
	const doc = $("html, body");
	$(".switch").on("click", function (e) {
		if (e.target.id === "switch-right") {
			doc.animate(
				{
					scrollTop: 0,
				},
				animationTime
			);
		} else {
			doc.animate(
				{
					scrollTop: $(document).height(),
				},
				animationTime
			);
		}
	});
}
