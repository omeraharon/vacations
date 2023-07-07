import { Redirect, Route, Switch } from "react-router-dom";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import Register from "../../AuthArea/Register/Register";
import AddVacation from "../../VacationArea/AddVacation/AddVacation";
import UpdateVacation from "../../VacationArea/UpdateVacation/UpdateVacation";
import VacationList from "../../VacationArea/VacationList/VacationList";
import Page404 from "../Page404/Page404";

function Routing(): JSX.Element {
    return (
        <Switch>
            <Route path="/login" component={Login} exact />
            <Route path="/home" component={VacationList} exact />
            <Route path="/logout" component={Logout} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/vacations/update/:uuid" component={UpdateVacation} exact />
            <Route path="/vacations/add" component={AddVacation} exact />

            <Redirect from="/" to="/login" exact />
            <Route component={Page404} />
        </Switch>
    );
}

export default Routing;
