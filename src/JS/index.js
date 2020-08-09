// Import Scss File
import "../sass/main.scss";
// Import Materialize JS Functions
import "materialize-css/dist/js/materialize.min.js";
// Importing Jquery
import $ from "jquery";
import { auth } from "./Firebase";
import { showBoard } from "./MessageBoard";
import switchPage from "./ViewControl";
import App from "./App";

// Initalizing Navbar and dropdown
$(document).ready(function () {
	switchPage("form");
});
// Auth State Changes
auth.onAuthStateChanged((user) => {
	if (user) {
		showBoard("welcome", user.displayName, function () {
			const { displayName, email, photoUrl } = user;
			switchPage("app", { displayName, email, photoUrl });
			App(user);
		});
	} else {
		switchPage("form");
	}
});
