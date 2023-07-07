
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import { vacationAddedAction } from "../../../Redux/VacationsState";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/JwtAxios";
import notify from "../../../Services/Notify";
import SocketService from "../../../Services/SocketService";
import "./AddVacation.css";

function AddVacation(): JSX.Element {
    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<VacationModel>();
    let addVacationRealTime: SocketService = new SocketService();

    if(!store.getState().authState.user) {
        history.push("/login");
        return <></>;
    }

    if (!store.getState().authState.user.isAdmin) {
        history.push("/home");
        return <></>;
    }

    async function addVacation(vacation: VacationModel) {
        try {
            const {data} = await jwtAxios.post<VacationModel>(globals.addVacationUrl, VacationModel.convertToFormDataPost(vacation));
            store.dispatch(vacationAddedAction(data));
            addVacationRealTime.connect();
            addVacationRealTime.addVacation(data);
            
            notify.success("Vacation has been added");
            history.push("/home");
        }
        catch (err) {
            if(!err.response) return notify.error(err);
            if(err.response.status === 403 || err.response.status === 401) return history.push("/logout");
            notify.error(err);
        }
    }

    return (
        <div className="AddVacation">

            <h2>Add Vacation</h2>
            <form onSubmit={handleSubmit(addVacation)}>
                <label>Description </label>
                <textarea autoFocus {...register("description", { required: true, minLength: 2, maxLength: 300 })} />
                {formState.errors.description?.type === "required" && <span>Missing description.</span>}
                {formState.errors.description?.type === "minLength" && <span>Description too short.</span>}
                {formState.errors.description?.type === "maxLength" && <span>Description too long.</span>}

                <label>Destination </label> 
                <input type="text" {...register("destination", { required: true, minLength: 2, maxLength: 200 })} />
                {formState.errors.destination?.type === "required" && <span>Missing destination.</span>}
                {formState.errors.destination?.type === "minLength" && <span>Destination too short.</span>}
                {formState.errors.destination?.type === "maxLength" && <span>Destination too long.</span>}

                <label>From </label> 
                <input type="date" {...register("startDate", { required: true })} />
                {formState.errors.startDate?.type === "required" && <span>Missing start date.</span>}

                <label>To </label> 
                <input type="date" {...register("endDate", { required: true })} />
                {formState.errors.endDate?.type === "required" && <span>Missing end date.</span>}
                
                <label>Price </label> 
                <input type="number" step="0.01" {...register("price", { required: true, min: 0 })} />
                {formState.errors.price?.type === "required" && <span>Missing price.</span>}
                {formState.errors.price?.type === "min" && <span>Price can't be negative.</span>}
                
                <label>Image </label> <br />
                <input type="file" accept="image/*" className="custom-file-input" {...register("image", { required: true })} />
                {formState.errors.image?.type === "required" && <span>Missing image.</span>}

                <button className="button-style">Add</button>

            </form>

        </div>
    );
}

export default AddVacation;
