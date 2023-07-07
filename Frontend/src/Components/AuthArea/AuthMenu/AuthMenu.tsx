
import { Component } from "react";
import "./AuthMenu.css";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import UserModel from "../../../Models/UserModel";
import store from "../../../Redux/Store";

interface AuthMenuState {
    user: UserModel;
}

class AuthMenu extends Component<{}, AuthMenuState> {

    private unsubscribe: Unsubscribe;

    public constructor(props: {}) {
        super(props);
        this.state = { user: store.getState().authState.user };
    }

    public componentDidMount(): void {
        this.unsubscribe = store.subscribe(() => this.setState({ user: store.getState().authState.user }));
    }

    public render(): JSX.Element {
        return (
            <div className="AuthMenu">
                {
                    this.state.user &&
                    <>
                        <span>Hello {this.state.user.firstName + " " + this.state.user.lastName} </span>
                        {this.state.user.isAdmin ? <NavLink className="link" to="/vacations/add">
                            Add Vacation</NavLink> : ""}
                        <span> | </span>
                        <NavLink className="link" to="/home">Home</NavLink>
                        <span> | </span>
                        <NavLink className="link" to="/logout" exact>Log out</NavLink>
                    </>
                }
            </div>
        );
    }

    public componentWillUnmount(): void {
        this.unsubscribe();
    }
}

export default AuthMenu;
