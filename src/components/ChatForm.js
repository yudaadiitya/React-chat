import React, { Component } from 'react'

export default class Chatform extends Component {
    constructor(props) {
        super(props);
        this.state = { name: '', message: '' };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeMessage = this.handleChangeMessage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeName(event) {
        this.setState({ name: event.target.value });
    }

    handleChangeMessage(event) {
        this.setState({ message: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.add(this.state.name, this.state.message);
        this.setState({ name: '', message: '' })
    }

    render() {
        return (

            <div className="bottom_wrapper clearfix">
                <form onSubmit={this.handleSubmit}>
                    <div className="message_input_wrapper">
                        <input class="message_input" placeholder="Your name..." value={this.state.name} onChange={this.handleChangeName} />
                    </div>
                    <div className="message_input_wrapper">
                        <input class="message_input" placeholder="Write your chat here..." value={this.state.message} onChange={this.handleChangeMessage} />
                    </div>
                    <button className="btn btn-send btn-lg btn-block" id="btn-chat">
                        <i className="fas fa-paper-plane"></i></button>
                </form>
            </div>

        );
    }
}