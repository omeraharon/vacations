class VacationModel {
    public vacationId: number;
    public uuid: string;
    public description: string;
    public destination: string;
    public startDate: Date;
    public endDate: Date;
    public price: number;
    public imageName: string;
    public image: FileList;
    public followersCount: number;

    public static convertToFormDataPost(vacation: VacationModel): FormData {
        const myFormData = new FormData();
        myFormData.append("description", vacation.description);
        myFormData.append("destination", vacation.destination);
        myFormData.append("startDate", vacation.startDate.toString());
        myFormData.append("endDate", vacation.endDate.toString());
        myFormData.append("price", vacation.price.toString());
        myFormData.append("image", vacation.image.item(0));
        
        return myFormData;
    }

    public static convertToFormDataPatch(vacation: VacationModel): FormData {
        const myFormData = new FormData();
        myFormData.append("vacationId", vacation.vacationId.toString());
        myFormData.append("description", vacation.description.toString());
        myFormData.append("destination", vacation.destination.toString());
        myFormData.append("startDate", vacation.startDate.toString());
        myFormData.append("endDate", vacation.endDate.toString());
        myFormData.append("price", vacation.price.toString());
        if(vacation.image) myFormData.append("image", vacation.image.item(0));
        myFormData.append("imageName", vacation.imageName.toString());
        
        return myFormData;
    }

}

export default VacationModel;