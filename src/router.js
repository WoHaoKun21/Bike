import { HashRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";
import Home from "./pages/home";
import Admin from "./Admin";
const IRouter = () => {
    return (
        <Router>
            <App>
                <Switch>
                    <Route to="/" render={() => 
                        <Admin>
                            <Route to="/home" component={Home} />
                        </Admin>
                    } />
                </Switch>
            </App>
        </Router>
    );
}
export default IRouter;