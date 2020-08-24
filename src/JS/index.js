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
		const state =
			user.metadata.creationTime === user.metadata.lastSignInTime
				? "new"
				: "welcome";
		showBoard(state, user.displayName, function () {
			const { displayName } = user;

			switchPage("app", { displayName });
			$("#close-icon").on("click", () => App(user));
		});
	}
});
