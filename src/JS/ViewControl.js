import $ from "jquery";
const formPage = `<section class="loggedOut" id="loggedOut">
<div class="container">
    <div class="introduction">

        <h1 class="brand-logo center-align main-color">
            <div class="left-header-line"></div> Argent%
            <div class="right-header-line"></div>
        </h1>
        <p>the ultimate budget planner so you can finally spend money more wisely</p>


    </div>

    <div class="signForm">
        <div class="col s6 m7">
            <div class="card horizontal">
                <div class="signUpWith">
                    <h4><span id="state">Create</span> your account</h4>
                    <a class="waves-effect waves-light btn facebook"><i
                            class="fab fa-facebook-square left"></i><span class="state-social">Create</span>
                        with Facebook</a><a class="waves-effect waves-light btn google"><i
                            class="fab fa-google left"></i><span class="state-social">Create</span> with
                        Google</a><a class="waves-effect waves-light btn twitter"><i
                            class="fab fa-twitter left"></i><span class="state-social">Create</span>
                        with
                        Twitter</a>


                </div>
                <div class="card-signIn">
                    <h4>Sign-In with email</h4>
                    <div class="row">
                        <form class="col s12" id="sign-in">
                            <div class="row">
                                <div class="input-field col s12">
                                    <i class="material-icons prefix">mail</i>
                                    <input id="sign-in-email" type="email" class="validate" autocomplete="off"
                                        required>
                                    <label for="sign-in-email">Email</label>
                                    <span class="helper-text" data-error="Email is invalid"
                                        data-success="Email is valid"></span>
                                </div>

                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <i class="material-icons prefix">lock</i>
                                    <input id="sign-in-password" type="password" class="password"
                                        autocomplete="off" required>
                                    <label for="sign-in-password">Password</label>
                                    <span class="helper-text"
                                        data-error="Either Email or Password is invalid"></span>
                                </div>

                            </div>
                            <div class="row">
                                <div class="col s12">
                                    <div id="sign-in-action">
                                        <button type="submit"
                                            class="waves-effect waves-light btn submit main-background"
                                            id="sign-in-btn">SIGN
                                            IN</button>
                                        <img src="./assets/loader.svg" class="loader" hidden />
                                    </div>
                                    <a href="#" class="main-color already switch" id="switch-left">Don't have an
                                        account?</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <h5 class="main-color">Or use the classical way</h5>
                        <div class="card-form">
                            <div class="row">
                                <form class="col s12" id="sign-up">
                                    <div class="row">
                                        <div class="input-field col s6">
                                            <i class="material-icons prefix">account_circle</i>
                                            <input id="first-name" type="text" class="validate" required
                                                autocomplete="off">

                                            <label for="first-name">First Name</label>

                                        </div>
                                        <div class="input-field col s6">
                                            <i class="material-icons prefix">account_circle</i>
                                            <input id="last-name" type="text" class="validate" required
                                                autocomplete="off">

                                            <label for="last-name">Last Name</label>

                                        </div>

                                    </div>


                                    <div class="row">
                                        <div class="input-field col s12">
                                            <i class="material-icons prefix">mail</i>
                                            <input id="sign-up-email" type="email" class="validate" required
                                                autocomplete="off">
                                            <label for="sign-up-email">Email</label>
                                            <span class="helper-text" data-error="Email is invalid"
                                                data-success="Email is valid"></span>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="input-field col s12">
                                            <i class="material-icons prefix">lock</i>
                                            <input id="sign-up-password" type="password" class="password"
                                                required autocomplete="off">
                                            <label for="sign-up-password">Password</label>
                                            <span class="helper-text"
                                                data-error="Password must be minimum eight characters, at least one letter and one number"
                                                data-success="Password is valid"></span>
                                        </div>

                                    </div>

                                    <div class="row">
                                        <div class="col s12">
                                            <div id="sign-up-action">
                                                <button type="submit"
                                                    class="waves-effect waves-light btn submit main-background"
                                                    id="sign-up-btn">SIGN
                                                    UP</button>
                                                <img src="./assets/loader.svg" class="loader" hidden />
                                            </div>

                                            <a href="#" class="main-color already switch"
                                                id="switch-right">Already
                                                have
                                                an
                                                account?</a>

                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</section>`;
const appPage = `<section class="loggedIn" id="loggedIn">
<nav class="pink lighten-2">
    <div class="nav-wrapper">
        <a href="#" class="brand-logo">Argent <span class="material-icons">
                account_balance_wallet
            </span></a>
        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li><a class="dropdown-trigger" href="#!" data-target="dropdown1">Hello, Noureldine!</a></li>
        </ul>
    </div>
    <ul class="sidenav" id="mobile-demo">
        <li><a href="#!">Sass</a></li>
        <li><a href="#!">Components</a></li>
        <li><a href="#!">Javascript</a></li>
        <li><a href="#!">Mobile</a></li>
    </ul>
    <ul id="dropdown1" class="dropdown-content">
        <li><a href="#!">one</a></li>
        <li><a href="#!">two</a></li>
        <li class="divider"></li>
        <li><a href="#!">three</a></li>
    </ul>
</nav>
</section>`;
const body = $(".messageBoard");
export default function (page) {
	switch (page) {
		case "form":
			$("#loggedIn").remove();
			body.after(formPage);
			break;
		case "app":
			$("#loggedOut").remove();
			body.after(appPage);
			break;
	}
}
