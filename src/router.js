import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import App from "./App";
import Home from "./pages/home";
import Admin from "./Admin";
import NoMatch from "./pages/noMatch";
import City from "./pages/city/inde";
const IRouter = () => {
    return (
        <Router>
            <App>
                <Switch>
                    <Route path="/" render={() =>
                        <Admin>
                            <Switch>
                                <Route path="/home" component={Home} />
                                <Route path="/city" component={City} />
                                <Redirect to="/home" />
                                <Route component={NoMatch} />
                            </Switch>
                        </Admin>
                    } />
                </Switch>
            </App>
        </Router>
    );
}
export default IRouter;