"use client"



export default function Page({params}: {params: {id: string}}) {
    const {id} = params

    return (
        <div>
            <h1>Chat</h1>
            <p>{id}</p>
        </div>
    )
}
