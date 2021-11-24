import axios from 'axios';
import { User, UserType } from '../../configsaver/model/city-view-config';
import Cookies from 'js-cookie';
class LoginController {



    constructor(){
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



                axios.post('http://localhost:8080/users', usr).then(response => {

                    console.log("Trying to log in");

                    Cookies.set('varicity-connected-user', response.data, { path: '', sameSite: 'strict' });
                    console.log(response.data);

                    if (document.URL.endsWith('/')) {
                        document.location.href = document.URL + 'ui.html'
                    }
                    else {
                        document.location.href = document.URL + '/ui.html'
                    }


                }).catch(err => {
                    console.log(err);
                });

            });
        });


    }
}

new LoginController();