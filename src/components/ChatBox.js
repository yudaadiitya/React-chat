import React, { Component } from "react";
import ChatForm from "./ChatForm";
import ChatList from "./ChatList";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io('http:localhost:3001');

const request = axios.create({
    baseURL: 'http://localhost:3001/api',
    timeout: 1000,
    headers: { "X-Custom-Header": "foobar" }
});


export default class ChatBox extends Component {
    constructor(props) {
        super(props)
        this.state = { data: [] }
        this.addChat = this.addChat.bind(this)
        this.removeChat = this.removeChat.bind(this)
        this.resendChat = this.resendChat.bind(this)
    }

    componentDidMount() {
        this.loadChat()
        socket.on('chat', function (data) {
            console.log(data)
            this.setState((state, props) => (
                {
                    data: [...state.data, { ...data, sent: true }]
                }))
        }.bind(this))

        socket.on('delete-chat', function (id) {
            console.log(id)
            this.setState((state, props) => ({
                data: state.data.filter(item => {
                    return item.id !== id.id
                })
            }))
        }.bind(this))

    }

    loadChat() {
        request.get('chats').then(data => {
            const completeData = data.data.map(item => {
                item.sent = true;
                return item
            })
            console.log(completeData)
            this.setState({ data: data.data })
        }).catch(err => {
            console.log('error get chat', err)
        })

    }

    addChat(name, message) {
        const id = Date.now();

        this.setState((state, props) => ({
            data: [...state.data, { id, name, message, sent: true }]
        }));

        socket.emit('chat', {
            id,
            name,
            message
        })

        request.post('chats', {
            id,
            name,
            message
        }).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err)
            this.setState((state, props) => ({
                data: state.data.map(item => {
                    if (item.id === id) {
                        item.sent = false;
                    }
                    return item;
                })
            }));
        })
    }




    removeChat(id) {
        this.setState((state, props) => ({
            data: state.data.filter(item => item.id !== id)
        }));

        socket.emit('delete-data', {id})

        //delete beckend chat
        request.delete(`chats/${id}`).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        })
    }




    resendChat(id, name, message) {
        request.post('chats', {
            id,
            name,
            message
        }).then(data => {
            console.log(data)
            this.setState((state, props) => ({
                data: state.data.map(item => {
                    if (item.id === id) {
                        item.sent = true;
                    }
                    return item;
                })
            }));
        }).catch(err => {
            console.log(err)
        })
    }






    render() {
        return (
            <div>
                <div className="chat_window overflow-auto">
                    <div className="top_menu">
                        <div className="buttons">
                            <div className="button close"></div>
                            <div className="button minimize"></div>
                            <div className="button maximize"></div>
                        </div>
                        <div className="title">React Chat</div>
                    </div>
                    <div>
                    <ul className="messages">
                        <ChatList data={this.state.data} remove={this.removeChat} resend={this.resendChat} />
                    </ul>
                    </div>
                    <div>
                    <ChatForm add={this.addChat} />
                    </div>
                </div>
            </div>
        );
    }
}
