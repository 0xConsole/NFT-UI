import React, { useEffect } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import "./scss/style.scss";
import ReactGA from "react-ga";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
ReactGA.initialize("UA-204654169-1");

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const Toast = () => (
  <div className="p-3 d-flex justify-content-around align-items-center">
    <div className="pl-3 pr-5" style={{ fontSize: "3rem" }}>
      📣
    </div>
    <div>
      <div>
        Configuration Changes Implemented:<br/>
        SHI3LD-ELK from 35x to 15x<br/>
        ELK from 25x to 5x fee to 1%<br/>
        Added WBTC vault at 35x<br/>
      </div>
      <div>Next change: <br/>
       QUICK from 10x to 5x fee to 1%
      </div>
      <div>When: 17:00 UTC on October 7th</div>
    </div>
  </div>
);

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));

function App() {
  useEffect(() => {
    //toast(<Toast />);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <HashRouter>
      <ToastContainer autoClose={false} limit={1} />
      <React.Suspense fallback={loading}>
        <Switch>
          <Route
            path="/"
            name="Home"
            render={(props) => <TheLayout {...props} />}
          />
        </Switch>
      </React.Suspense>
    </HashRouter>
  );
}

export default App;
