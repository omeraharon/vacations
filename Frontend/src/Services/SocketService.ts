import {io, Socket} from "socket.io-client";
import VacationModel from "../Models/VacationModel";

class SocketService {
    public socket: Socket;

    public connect() {
        this.socket = io("http://localhost:3007");
    }
    public disconnect() {
        this.socket.disconnect();
    }

    public addVacation(vacation: VacationModel): void {
        this.socket.emit("add-active-from-client", vacation);
    }
    public updateVacation(vacation: VacationModel): void {
        this.socket.emit("update-active-from-client", vacation);
    }
    public deleteVacation(uuid: string): void {
        this.socket.emit("delete-active-from-client", uuid);
    }
}

export default SocketService;