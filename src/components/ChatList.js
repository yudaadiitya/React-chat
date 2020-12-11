import React from 'react'
import Chat from './Chat'

export default function Chatlist(props) {
    const chatlist = props.data.map((item,index) => 
        <Chat
            index = {index}
            key = {item.id}
            name={item.name}
            message={item.message}
            sent={item.sent}
            resend={() => props.resend(item.id, item.name, item.message)}
            hapus={() => props.remove(item.id)}
        />)

    return (
        <div>{chatlist}</div>
    )
}