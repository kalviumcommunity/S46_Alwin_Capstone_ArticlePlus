import { useEffect, useState } from "react"
import { useSignals } from "@preact/signals-react/runtime"

import useKeyPress from "@/helpers/hooks/useKeyPress"
import axiosInstance from "@/axios"

function usePlaygroundLogic({ articleId }) {
    useSignals()

    const isEscPressed = useKeyPress("Escape")

    const [isFullscreen, setIsFullscreen] = useState(false)
    const [selectedLayout, setSelectedLayout] = useState("default")
    const [selectedElementType, setSelectedElementType] = useState(null)

    const [article, setArticle] = useState({
        title: "Here goes your title for the article",
        subtitle: "Write what is the short summary/hook for the article",
        display: "header",
        flow: "default",
        slug: "here-goes-your-title-for-the-article",
        author: {
            name: "",
            id: "",
            type: "",
            organization: {
                name: "",
                id: "",
            },
        },
        timestamp: new Date().toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        }),
        category: "tag-for-article",
        image: {
            url: "https://placehold.co/960x1400/fafafa/222222/svg?text=Image+Goes+Here&font=Lato",
            caption: "Placeholder caption or description",
            credit: "Placeholder credit",
        },
        content: [],
    })

    const contentBoilerPlate = [
        {
            type: "text",
            text: "Here goes your text for the article",
        },
        {
            type: "image",
            url: "https://media.newyorker.com/photos/65fc513fa938d6709b3d8be7/master/w_1920,c_limit/WonderCityOfTheWorld_p067a_web.jpg",
            caption: "Placeholder caption or description",
            credit: "Placeholder credit",
        },
        {
            type: "quote",
            text: "Here goes your quote for the article",
            reference: "Refrence if any",
        },
    ]

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    const handleSelectElement = (type) => {
        setSelectedElementType(type)
    }

    const handleLayoutChange = (event) => {
        const { value } = event.target
        setSelectedLayout(value)

        const layoutOptions = {
            default: { display: "header", flow: "default" },
            "default-reverse": { display: "header", flow: "reverse" },
            square: { display: "square", flow: "default" },
            "square-reverse": { display: "square", flow: "reverse" },
        }

        const { display, flow } = layoutOptions[value] || {}

        setArticle((prevArticle) => ({
            ...prevArticle,
            display,
            flow,
        }))
    }

    const handleArticleDBUpdate = () => {
        axiosInstance.get(`article/${articleId}`).then((res) => {
            ;({ ...article, ...res.data })
        })
    }

    useEffect(() => {
        if (isFullscreen && isEscPressed) {
            setIsFullscreen(false)
        }
    }, [isEscPressed])

    useEffect(() => {
        axiosInstance
            .get(`article/${articleId}`)
            .then((res) => {
                setArticle((prevArticle) => ({
                    ...prevArticle,
                    ...res.data,
                    ...(res.data?.content?.length > 0
                        ? { content: res.data.content }
                        : { content: contentBoilerPlate }),
                }))
            })
            .catch((err) => {
                console.log(err)
            })
    }, [articleId])

    return {
        isFullscreen,
        article,
        selectedElementType,
        setArticle,
        toggleFullscreen,
        selectedLayout,
        handleLayoutChange,
        handleArticleDBUpdate,
        handleSelectElement,
    }
}

export default usePlaygroundLogic
