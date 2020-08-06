import Modal from "./Modal";

// Import Scss File
import "../sass/main.scss";
// Import Materialize JS Functions
import "materialize-css/dist/js/materialize.min.js";
// Importing Jquery
import $ from "jquery";
// Set up Firebase

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
