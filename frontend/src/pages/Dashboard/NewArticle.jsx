import React from "react"

import Editor from "@/components/Dashboard/Editor"

function NewArticle() {
    return (
        <div className="">
            <h1 className="mt-8 border-b px-8 pb-5 text-2xl font-semibold">New article</h1>
            <Editor />
        </div>
    )
}

export default NewArticle
