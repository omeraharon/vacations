
import "./Login.css";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import store from "../../../Redux/Store";
import { userLoggedInAction } from "../../../Redux/AuthState";
import globals from "../../../Services/Globals";
import CredentialsModel from "../../../Models/CredentialsModel";
import UserModel from "../../../Models/UserModel";
import notify from "../../../Services/Notify";
import { NavLink } from "react-router-dom";
import jwtAxios from "../../../Services/JwtAxios";

function Login(): JSX.Element {
    const isUser = store.getState().authState.user || null;
    const history = useHistory();
    
    const { register, handleSubmit, formState } = useForm<CredentialsModel>();

    async function submit(credentials: CredentialsModel, event: any) {
        try {
            (event.target as HTMLFormElement).reset();
            const {data} = await jwtAxios.post<UserModel>(globals.loginUrl, credentials);
            store.dispatch(userLoggedInAction(data));
            notify.success("Logged-in successfully.");
            history.push("/home");
        }
        catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="Login">
            {!isUser ? <form onSubmit={handleSubmit(submit)}>
                <h2>Vacations</h2>
                <label>Username</label>
                <input type="text" autoFocus {...register("username", {
                    required: { value: true, message: "Missing username." },
                    minLength: { value: 4, message: "Username too short." }
                })} />
                <span>{formState.errors.username?.message}</span>
                <br />
                <label>Password</label>
                <input type="password" {...register("password", {
                    required: { value: true, message: "Missing password." },
                    minLength: { value: 2, message: "Password too short." }
                })} />
                <span>{formState.errors.password?.message}</span>

                <button className="button-style">Log in</button> 

                <NavLink className="link" to="/register">
                    You don`t have an account ? register now !
                </NavLink>
            </form> : <p>You are Logged in, <NavLink to="/home">go to Home</NavLink></p>}
        </div>
    );
}

export default Login;