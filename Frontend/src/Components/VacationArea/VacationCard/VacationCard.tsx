

import VacationModel from "../../../Models/VacationModel";
import globals from "../../../Services/Globals";
import moment from "moment";
import "./VacationCard.css";
import { NavLink, useHistory } from "react-router-dom";
import notify from "../../../Services/Notify";
import jwtAxios from "../../../Services/JwtAxios";
import store from "../../../Redux/Store";
import { vacationDeletedAction, vacationsDownloadedAction } from "../../../Redux/VacationsState";
import { useState } from "react";
import UserModel from "../../../Models/UserModel";
import { useEffect } from "react";
import SocketService from "../../../Services/SocketService";

interface VacationCardProps {
    vacation: VacationModel;
}

function VacationCard(props: VacationCardProps): JSX.Element {
    const [user, setUser] = useState<UserModel>(null);
    const [followStatus, setFollowStatus] = useState<boolean>(false);
    let deleteVacationRealTime: SocketService = new SocketService();
    const { vacation } = props;

    useEffect(() => {
        setUser(store.getState().authState.user);

        (async () => {
            try {
                const followObj = {id: store.getState().authState.user.id, vacationId: vacation.vacationId}
                const {data} = await jwtAxios.post(`${globals.followersUrl}status`, followObj);
                setFollowStatus(data.isFollow);
            }
            catch(err) {
                notify.error(err);
            }
        })();
    }, [followStatus]);

    if (!vacation) return <></>;
    if(!user) return <></>;

    const startDateFormat = moment(vacation.startDate).format("DD.MM.YYYY");
    const endDateFormat = moment(vacation.endDate).format("DD.MM.YYYY");

    async function deleteVacation() {
        try {
            const answer = window.confirm("Are you sure you want to delete the vacation ?");
            if(!answer) return;

            deleteVacationRealTime.connect();
            deleteVacationRealTime.deleteVacation(vacation.uuid);

            await jwtAxios.delete<VacationModel>(globals.vacationsUrl + vacation.uuid);
            notify.success("Vacation has been deleted !");
        }
        catch(err) {
            notify.error(err);
        }
    }

    async function addFollow() {
        try {
            const followObj = {id: user.id, vacationId: vacation.vacationId}
            const {data} = await jwtAxios.post<VacationModel[]>(`${globals.followersUrl}follow`, followObj);
            store.dispatch(vacationsDownloadedAction(data));
            setFollowStatus(true);
        }
        catch(err) {
            notify.error(err);
        }
    }

    async function deleteFollow() {
        try {
            const followObj = {id: user.id, vacationId: vacation.vacationId}
            const {data} = await jwtAxios.post<VacationModel[]>(`${globals.followersUrl}remove`, followObj);
            store.dispatch(vacationsDownloadedAction(data));
            setFollowStatus(false);
        }
        catch(err) {
            notify.error(err);
        }
    }

    return (
        <div className="VacationCard">
            <img src={globals.vacationImage + vacation.imageName} alt="background" />
            <div className="card-content">
                <span>Destination: {vacation.destination}</span>
                <p>Description: {vacation.description}</p>

                {user.isAdmin ? <div className="admin-icons">
                    <NavLink className="edit-link" to={"/vacations/update/" + vacation.uuid}>Edit 📝</NavLink>
                    <button className="delete-button-style" onClick={deleteVacation}>Delete</button>
                </div> : <></>}
                
                {!user.isAdmin && <div className="followers-area">
                    <span>{vacation.followersCount} Followers</span>
                    <hr />
                    {!followStatus ?
                    <button className="follow-button-style" onClick={addFollow}>Not Following👎</button>
                    :
                    <button className="button-style" onClick={deleteFollow}>Following👍</button>}
                </div>}

                <div className="bottom-card">
                    <span>from: {startDateFormat}</span>
                    <span>to: {endDateFormat}</span>
                    <span>Price: {vacation.price}$</span>
                </div>
            </div>
        </div >
    );
}

export default VacationCard;
