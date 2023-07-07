
import "./Register.css";
import { useForm } from "react-hook-form";
import globals from "../../../Services/Globals";
import store from "../../../Redux/Store";
import { userRegisteredAction } from "../../../Redux/AuthState";
import UserModel from "../../../Models/UserModel";
import notify from "../../../Services/Notify";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import jwtAxios from "../../../Services/JwtAxios";

function Register(): JSX.Element {
    const isUser = store.getState().authState.user || null;
    const history = useHistory();
    if(isUser) history.push("/home");

    const { register, handleSubmit, formState } = useForm<UserModel>();

    async function submit(user: UserModel) {
        try {
            const {data} = await jwtAxios.post<UserModel>(globals.registerUrl, user);
            store.dispatch(userRegisteredAction(data));
            notify.success("You have been successfully registered.");
            history.push("/home");
        }
        catch (err) {
            notify.error(err);
        }
    }

    return (
        <div className="Register Box">

            <h2>Register</h2>
            <form onSubmit={handleSubmit(submit)}>

                <label>First Name:</label>
                <input type="text" autoFocus {...register("firstName", {
                    required: { value: true, message: "Missing first name." },
                    minLength: { value: 2, message: "First name too short." }
                })} />
                <span>{formState.errors.firstName?.message}</span>

                <label>Last Name:</label>
                <input type="text" {...register("lastName", {
                    required: { value: true, message: "Missing last name." },
                    minLength: { value: 2, message: "Last name too short." }
                })} />
                <span>{formState.errors.lastName?.message}</span>

                <label>Username:</label>
                <input type="text" {...register("username", {
                    required: { value: true, message: "Missing username." },
                    minLength: { value: 4, message: "Username too short." }
                })} />
                <span>{formState.errors.username?.message}</span>

                <label>Password:</label>
                <input type="password" {...register("password", {
                    required: { value: true, message: "Missing password." },
                    minLength: { value: 3, message: "Password too short." }
                })} />
                <span>{formState.errors.password?.message}</span>

                <button className="button-style">Register</button>

                <NavLink className="link" to="/login">
                    You have an account ? click to login !
                </NavLink>
            </form>
        </div>
    );
}

export default Register;