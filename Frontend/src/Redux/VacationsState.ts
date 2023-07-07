

import VacationModel from "../Models/VacationModel";

export class VacationsState {
    public vacations: VacationModel[] = [];
}

export enum VacationsActionType {
    VacationsDownloaded = "VacationsDownloaded",
    VacationAdded = "VacationAdded",
    VacationUpdated = "VacationUpdated",
    VacationDeleted = "VacationDeleted",
}

export interface VacationsAction {
    type: VacationsActionType
    payload?: any; 
}

export function vacationsDownloadedAction(vacations: VacationModel[]): VacationsAction {
    return { type: VacationsActionType.VacationsDownloaded, payload: vacations};
}
export function vacationAddedAction(addedVacation: VacationModel): VacationsAction {
    return { type: VacationsActionType.VacationAdded, payload: addedVacation };
}
export function vacationUpdatedAction(updatedVacation: VacationModel): VacationsAction {
    return { type: VacationsActionType.VacationUpdated, payload: updatedVacation };
}
export function vacationDeletedAction(uuid: string): VacationsAction {
    return { type: VacationsActionType.VacationDeleted, payload: uuid };
}

export function vacationsReducer(currentState: VacationsState = new VacationsState(), action: VacationsAction): VacationsState {

    const newState = { ...currentState };

    switch (action.type) {

        case VacationsActionType.VacationsDownloaded: 
            newState.vacations = action.payload;
            break;

        case VacationsActionType.VacationAdded:
            newState.vacations.push(action.payload);
            break;

        case VacationsActionType.VacationUpdated:
            const indexToUpdate = newState.vacations.findIndex(v => v.uuid === action.payload.uuid);
            newState.vacations[indexToUpdate] = action.payload;
            break;

        case VacationsActionType.VacationDeleted:
            const indexToDelete = newState.vacations.findIndex(v => v.uuid === action.payload);
            newState.vacations.splice(indexToDelete, 1);
            break;
    }

    return newState;

}