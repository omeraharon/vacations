
class Globals {
    // auth
    public baseUrl = process.env.NODE_ENV === "development" ? 'http://localhost:3007/api/' : 'http://mySite.com/';
    public registerUrl = `${this.baseUrl}auth/register/`;
    public loginUrl = `${this.baseUrl}auth/login/`;
    public captchaUrl = `${this.baseUrl}auth/captcha`;
    // vacations
    public vacationsUrl = `${this.baseUrl}vacations/`;
    public addVacationUrl = `${this.baseUrl}vacations/add`;
    public vacationImage = `${this.baseUrl}vacations/images/`;
    public followersUrl = `${this.baseUrl}vacations/followers/`;
}

const globals =  new Globals();

export default globals;