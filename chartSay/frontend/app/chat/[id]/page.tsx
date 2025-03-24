"use client"

import { use } from 'react';


export default function Page({params}: {params: {id: string}}) {
  const resolvedParams = use(params);
  // 现在你可以安全地访问 id
  const id = resolvedParams.id;

    return (
        <div>
            <h1>Chat</h1>
            <p>{id}</p>
        </div>
    )
}
