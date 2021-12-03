import {User, UserType} from '../../configsaver/model/city-view-config';

class LoginController {

    constructor() {
        this.addListenerToRegisterBtn();
    }

    public async addListenerToRegisterBtn() {
        console.log("my method is called");

        document.addEventListener('DOMContentLoaded', (event) => {
            console.log('DOM fully loaded and parsed');
            document.querySelector("#loginbtn").addEventListener('click', async (clickev) => {

                console.log("Hello from Btn");

                let username = (document.querySelector("#username") as HTMLInputElement).value;
                let userType = (document.querySelector("#user-type") as HTMLInputElement).value;

                let usr = new User(username, userType as UserType);
                console.log(usr);

                if (document.URL.endsWith('/')) {
                    document.location.href = document.URL + 'ui.html'
                } else {
                    document.location.href = document.URL + '/ui.html'
                }
            });
        });
    }
}

new LoginController();
