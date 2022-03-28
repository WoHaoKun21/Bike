import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import App from "./App";
import Home from "./pages/home";
import Admin from "./Admin";
import NoMatch from "./pages/noMatch";
import City from "./pages/city/inde";
import Order from "./pages/order";
import OrderDetail from "./pages/order/Detail";
import Common from "./Common";
import User from "./pages/user";
import Map from "./pages/map";
const IRouter = () => {
    return (
        <Router>
            <App>
                <Switch>
                    <Route path="/common" render={() =>
                        <Common>
                            <Route path="/common/order/detail/:orderId" component={OrderDetail} />
                        </Common>
                    } />
                    <Route path="/" render={() =>
                        <Admin>
                            <Switch>
                                <Route path="/home" component={Home} />
                                <Route path="/city" component={City} />
                                <Route path="/order" component={Order} />
                                <Route path="/user" component={User} />
                                <Route path="/bikeMap" component={Map} />
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