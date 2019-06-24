
//const uuid = require('uuid');
let socket = null;
socket = io.connect();

let app = new Vue({
    el: '#app',
    data: {
        message: "",
        messages: [],
        message_form_error: false,
        login_form_error: false,
        logged: false,
        name: '',
        users: [],
        feedback: ''

    },
    methods: {
        login() {
            if (this.name) {
                this.login_form_error = false;
                this.logged = true;
                socket.emit('new user', this.name);
                socket.on('get users', (data) => {
                    this.users = data;
                });
            } else {
                this.login_form_error = true;
            }
        },
        typing() {
            console.log(this.name);
            socket.emit('typing', this.name);
        },
        sendMessage() {
            if (this.message) {
                this.message_form_error = false;
                const newMessage = {
                    message: this.message,
                    name: this.name
                };
                socket.emit('chat', newMessage);

                this.message = null;
                this.message_form_error = false;

                this.feedback = '';

            } else {
                this.message_form_error = true;
            }
        }
    },

    mounted() {
        socket.on('chat', (data) => {
            this.messages.push(data);
            let messageBox = document.getElementById('message-box');
            messageBox.scrollTop = messageBox.scrollHeight;
        });

        socket.on('typing', (name) => {
            this.feedback = `${name} is typing a message...`
        });

    }
});