import React from "react";
import { ethers } from "ethers";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import SearchPage from "./pages/SearchPage.js";
import Profile from "./pages/Profile.js";
import Marketplace from "./pages/Marketplace.js";
import Home from "./pages/Home.js";
import RitzyResoNavBar from "./common/RitzyResoNavBar.js";
import MyResos from "./pages/MyResos.js";
import LogoutPage from "./pages/LogoutPage.js";
import AboutPage from "./pages/AboutPage.js";

import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      csrf: "",
      error: "",
      isAuthenticated: false,
      provider: undefined,
      signer: undefined,
      metaMask: null,
      address: null,
      chain: null,
      cryptoToken: null,
      resoList: [],
      searchBar: {
        date: new Date(Date.now() + 3600 * 1000 * 24),
        time: new Date(3600 * 1000 * 18),
        diners: 2,
      },
    };

    this.setEthers = this.setEthers.bind(this);
    this.getCSRF = this.getCSRF.bind(this);
    this.getCryptoToken = this.getCryptoToken.bind(this);
    this.getSession = this.getSession.bind(this);
    this.getResos = this.getResos.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.changeAuthStatus = this.changeAuthStatus.bind(this);
    this.handleChangeSearchBar = this.handleChangeSearchBar.bind(this);
  }

  async componentDidMount() {
    // Calling crypto token will ensure a user is created for the relevant session
    // await this.getCryptoToken();
    await this.getResos();
    await this.getSession();
    await this.setEthers();
  }

  async setEthers() {
    if (window.ethereum === undefined) {
      console.log("no ethereum provider");
      this.setState({ metaMask: false });
    } else {
      let provider;
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((provider = new ethers.providers.Web3Provider(window.ethereum)));
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const chain = await signer.getChainId();
      // await this.getCryptoToken(); // Get the token, make the user account
      this.setState({ provider: provider, signer: signer, metaMask: true, address: address, chain: chain });

      window.ethereum.on("accountsChanged", function () {
        window.location.replace("/");
      });
    }
  }

  getCSRF() {
    fetch("/api/csrf/", {
      credentials: "same-origin",
    })
      .then((res) => {
        let csrfToken = res.headers.get("X-CSRFToken");
        this.setState({ csrf: csrfToken });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getCryptoToken() {
    const url = "/api/crypto_token/" + this.state.address;
    await fetch(url, {
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        // let formatted_res = res.json()
        let cryptoToken = data["crypto_token"];
        this.setState({ cryptoToken: cryptoToken });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getSession() {
    await fetch("/api/session/", {
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          this.setState({ isAuthenticated: true });
        } else {
          this.setState({ isAuthenticated: false });
          this.getCSRF();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getResos() {
    await fetch("/api/uri/v1/", {
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ resoList: data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  // Check to see if metamask and address loaded up before calling login
  handleLogin(event) {
    event.preventDefault();
    if (this.state.metaMask !== true) {
      alert("Metamask required for login");
    } else if (this.state.address === null) {
      alert("Please refresh page and connect a MetaMask account");
    } else {
      this.login(event);
    }
  }

  async login(event) {
    event.preventDefault();
    await this.getCryptoToken();
    const signedMessage = await this.state.signer.signMessage(this.state.cryptoToken);

    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.state.csrf,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        username: this.state.address,
        signed_message: signedMessage,
      }),
    })
      .then(this.isResponseOk)
      .then(() => {
        this.setState({
          isAuthenticated: true,
          username: "",
          password: "",
          error: "",
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: "Wrong account or signed message" });
      });
  }

  logout() {
    fetch("/api/logout", {
      credentials: "same-origin",
    })
      .then(this.isResponseOk)
      .then(() => {
        this.setState({ isAuthenticated: false });
        this.getCSRF();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  changeAuthStatus(status) {
    // little bit of input checking with an if statement
    if (status == true) {
      this.setState({ isAuthenticated: true });
    } else if (status == false) {
      this.setState({ isAuthenticated: false });
    }
  }

  handleChangeSearchBar(date, time, diners) {
    // Hmm not the most efficient but clean
    this.setState({
      searchBar: {
        date: date,
        time: time,
        diners: parseInt(diners),
      },
    });
  }

  render() {
    return (
      <Router>
        <div>
          <RitzyResoNavBar
            handleLogin={this.handleLogin.bind(this)}
            address={this.state.address}
            isAuthenticated={this.state.isAuthenticated}
          />

          <Switch>
            <Route exact path="/">
              <Home
                searchBar={this.state.searchBar}
                resoList={this.state.resoList}
                handleChangeSearchBar={this.handleChangeSearchBar.bind(this)}
              />
            </Route>
            <Route path="/marketplace">
              <Marketplace />
            </Route>
            <Route path="/search">
              <SearchPage
                searchBar={this.state.searchBar}
                handleChangeSearchBar={this.handleChangeSearchBar.bind(this)}
              />
            </Route>
            <Route path="/profile">
              <Profile csrf={this.state.csrf} />
            </Route>
            <Route path="/my_resos">
              <MyResos address={this.state.address} />
            </Route>
            <Route path="/logout">
              <LogoutPage changeAuthStatus={this.changeAuthStatus.bind(this)} />
            </Route>
            <Route path="/about">
              <AboutPage />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
