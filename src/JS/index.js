import Modal from "./Modal";

// Import Scss File
import "../sass/main.scss";
// Import Materialize JS Functions
import "materialize-css/dist/js/materialize.min.js";
// Importing Jquery
import $ from "jquery";
import { auth } from "./Firebase";
import { showBoard } from "./MessageBoard";
import switchPage from "./ViewControl";

// Initalizing Navbar and dropdown
$(document).ready(function () {
	$(".sidenav").sidenav();
	$(".dropdown-trigger").dropdown();
	$("a").on("click", function (e) {
		e.preventDefault();
	});
	// Modal interactivity
	Modal();
});
// Auth State Changes
auth.onAuthStateChanged((user) => {
	if (user) {
		showBoard("welcome", user.displayName, function () {
			switchPage("app");
		});
	} else {
		console.log("not logged");
	}
});
