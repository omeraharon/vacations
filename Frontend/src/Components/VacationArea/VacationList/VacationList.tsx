import { Component } from "react";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import { History } from "history";
import "./VacationList.css";
import notify from "../../../Services/Notify";
import jwtAxios from "../../../Services/JwtAxios";
import globals from "../../../Services/Globals";
import VacationCard from "../VacationCard/VacationCard";
import PleaseWait from "../../PleaseWait/PleaseWait";
import { vacationsDownloadedAction } from "../../../Redux/VacationsState";
import SocketService from "../../../Services/SocketService";
import { Unsubscribe } from "redux";

interface VacationListProps {
    history: History;
}

interface VacationListState {
	vacations: VacationModel[];
}

class VacationList extends Component<VacationListProps, VacationListState> {
    private vacationActivesRealTime: SocketService = new SocketService();
    private unsubscribe: Unsubscribe;
    public constructor(props: VacationListProps) {
        super(props);
        this.state = {
			vacations: store.getState().vacationsState.vacations
        };
    }

    public async componentDidMount() {
        try {
            this.vacationActivesRealTime.connect();

            if(!store.getState().authState.user) {
                notify.error("You are not logged in !");
                return this.props.history.push("/login");
            }

            if(this.state.vacations.length === 0) {
                const {data} = await jwtAxios.get<VacationModel[]>(globals.vacationsUrl);
                this.setState({ vacations: data });
                store.dispatch(vacationsDownloadedAction(data));
                await this.socketActives();
            }
            this.unsubscribe = store.subscribe(() => this.setState({vacations: store.getState().vacationsState.vacations}));
        }
        catch(err) {
            if(!err.response) return notify.error(err);
            if(err.response.status === 403 || err.response.status === 401) return this.props.history.push("/logout");
            notify.error(err);
        }
    }

    private socketActives() {
        this.vacationActivesRealTime.socket.on("add-active-from-server", vacation => {
            const vacations = [...this.state.vacations];
            vacations.push(vacation);
            this.setState({vacations});
        });
        this.vacationActivesRealTime.socket.on("delete-active-from-server", uuid => {
            console.log(uuid);
            const indexToDelete = this.state.vacations.findIndex(v => v.uuid === uuid);
            const vacations = [...this.state.vacations];
            vacations.splice(indexToDelete, 1);
            this.setState({vacations});
        });
        this.vacationActivesRealTime.socket.on("update-active-from-server", vacation => {
            const indexToUpdate = this.state.vacations.findIndex(v => v.uuid === vacation.uuid);
            const vacations = [...this.state.vacations];
            vacations[indexToUpdate] = vacation;
            this.setState({vacations});
        });
    }
    
    public render(): JSX.Element {
        return (
            <div className="VacationList">
                {this.state.vacations.length === 0 ? 
                <PleaseWait /> : this.state.vacations.map(v => <VacationCard vacation={v} key={v.vacationId} />)}
            </div>
        );
    }

    public componentWillUnmount() {
        this.vacationActivesRealTime.disconnect();
        if(this.unsubscribe !== undefined) this.unsubscribe();
    }
}

export default VacationList;
