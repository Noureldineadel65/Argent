import M from "materialize-css/dist/js/materialize.min.js";
export default function (e) {
	M.toast({ html: e.message });
}
