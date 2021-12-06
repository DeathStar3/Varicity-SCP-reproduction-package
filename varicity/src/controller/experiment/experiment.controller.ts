import {symfinderServiceUrl} from "../../constants";
import {SymfinderServiceResponse, SymfinderServiceResponseType} from "./response.model";
import '@material/mwc-dialog';
import '@material/mwc-button/mwc-button';
import '@material/mwc-radio/mwc-radio';
import '@material/mwc-formfield/mwc-formfield';
import '@material/mwc-textfield';
var W3CWebSocket = require('websocket').w3cwebsocket;
const snackbar = require('snackbar');

export class ExperimentController {

    client = new W3CWebSocket(`${symfinderServiceUrl}/start-websocket/patrick`, 'echo-protocol');


    constructor() {

        document.addEventListener('DOMContentLoaded', (_) => {

            var self = this;

            document.querySelector('#run-xp-btn').addEventListener('click', (_) => {
                var fr = new FileReader();
                fr.onload = function () {
                    self.client.send(fr.result);

                    console.log(fr.result);
                }

                fr.readAsText((document.querySelector('#experiment-input') as any).files[0]);

            })

        });


        this.client.onerror = function () {
            console.log('Connection Error');
        };

        this.client.onopen = function () {
            console.log('WebSocket Client Connected');

        };

        this.client.onclose = function () {
            console.log('echo-protocol Client Closed');
        };

        this.client.onmessage = function (e) {

            const response = (JSON.parse(e.data) as SymfinderServiceResponse);

            switch (response.type) {
                case SymfinderServiceResponseType.EXPERIMENT_FAILED:
                    document.querySelector('#experiment-failed-details').textContent = response.content;
                    document.querySelector('#dialog-experiment-failed').setAttribute('open', 'true');

                    break;

                case SymfinderServiceResponseType.EXPERIMENT_STARTED:
                    snackbar.show('Your experiment has started :' + response.content)
                    break;
                case SymfinderServiceResponseType.EXPERIMENT_INVALID:
                    document.querySelector('#experiment-failed-details').textContent = response.content;
                    document.querySelector('#dialog-experiment-failed').setAttribute('open', 'true');
                    break;
                case SymfinderServiceResponseType.EXPERIMENT_COMPLETED:
                    snackbar.show('Your experiment has been processed successfully :')
                    console.log(response.content)
                    break;
                default:
                    snackbar.show('State unknown');
                    break;
            }
            console.log("Received: '" + e.data + "'");

        };
        console.log('Connecting to the symfinderserver')

    }
}

//new ExperimentController();
