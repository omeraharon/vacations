import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, useHistory } from "react-router-dom";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import { vacationUpdatedAction } from "../../../Redux/VacationsState";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/JwtAxios";
import notify from "../../../Services/Notify";
import moment from "moment";
import "./UpdateVacation.css";
import SocketService from "../../../Services/SocketService";

interface RouteParams {
    uuid: string;
}

interface UpdateVacationProps extends RouteComponentProps<RouteParams> { }

function UpdateVacation(props: UpdateVacationProps): JSX.Element {
    const { register, handleSubmit, formState } = useForm<VacationModel>();
    const [vacationToUpdate, setVacationToUpdate] = useState<VacationModel>(null);
    let updateVacationRealTime: SocketService = new SocketService();
    const uuid = props.match.params.uuid;
    const history = useHistory();

    useEffect(() => {
        (async () => {
            try {
                const {data} = await jwtAxios.get<VacationModel>(globals.vacationsUrl + uuid);
                setVacationToUpdate(data);  
            }
            catch(err) {
                notify.error(err);
            }
        })();
    });

    if(!store.getState().authState.user) {
        history.push("/login");
        return <></>;
    }

    if (!store.getState().authState.user.isAdmin) {
        history.push("/home");
        return <></>;
    }

    if(!vacationToUpdate) return <></>;

    async function updateVacation(vacation: VacationModel) {
        try {
            getValues(vacation); // Check which values have changed
            const { data } = await jwtAxios.patch<VacationModel>(globals.vacationsUrl + props.match.params.uuid, VacationModel.convertToFormDataPatch(vacation));
            store.dispatch(vacationUpdatedAction(data));
            updateVacationRealTime.connect();
            updateVacationRealTime.updateVacation(data);
            notify.success("Vacation details saved successfully");
            history.push("/home");
        }
        catch (err) {
            if(!err.response) return notify.error(err);
            if(err.response.status === 403 || err.response.status === 401) return history.push("/logout");
            notify.error(err);
        }
    }

    function getValues(vacation: VacationModel) {
        vacation.vacationId = vacationToUpdate.vacationId;
        vacation.description = vacation.description || vacationToUpdate.description;
        vacation.destination = vacation.destination || vacationToUpdate.destination;
        vacation.startDate = vacation.startDate || vacationToUpdate.startDate;
        vacation.endDate = vacation.endDate || vacationToUpdate.endDate;
        vacation.price = vacation.price || vacationToUpdate.price;
        vacation.image = vacation.image || vacationToUpdate.image;
        vacation.imageName = vacationToUpdate.imageName;

        return vacation;
    }

    const startDateFormat = moment(vacationToUpdate.startDate).format("DD-MM-YYYY");
    const endDateFormat = moment(vacationToUpdate.endDate).format("DD-MM-YYYY");

    return (
        <div className="UpdateVacation">
            <h2>Update Vacation</h2>
            {vacationToUpdate &&
            <form onSubmit={handleSubmit(updateVacation)}>
                <label>Description </label>
                <textarea placeholder={vacationToUpdate.description} autoFocus {...register("description", { minLength: 2, maxLength: 300 })} />
                {formState.errors.description?.type === "minLength" && <span>Description too short.</span>}
                {formState.errors.description?.type === "maxLength" && <span>Description too long.</span>}

                <label>Destination </label>
                <input type="text" placeholder={vacationToUpdate.destination} {...register("destination", { minLength: 2, maxLength: 200 })} />  
                {formState.errors.destination?.type === "minLength" && <span>Destination too short.</span>}
                {formState.errors.destination?.type === "maxLength" && <span>Destination too long.</span>}

                <label>From </label>
                <input type="date" placeholder={"(" + startDateFormat + ") "} {...register("startDate")} />
                
                <label>To </label>
                <input type="date" placeholder={"(" + endDateFormat + ") "} {...register("endDate")} />

                <label>Price </label>
                <input type="number" placeholder={`${vacationToUpdate.price}`} step="0.01" {...register("price", { min: 0 })} />
                {formState.errors.price?.type === "min" && <span>Price can't be negative.</span>}

                <label>Image </label> <br />
                <input type="file" accept="image/*" className="custom-file-input" {...register("image")} />

                <button className="button-style">Update</button>

            </form>}
        </div>
    );
}

export default UpdateVacation;
