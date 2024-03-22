import { Link } from "react-router-dom"

function TagRibbion() {
    return (
        <div className="mx-12 flex justify-center border-b border-t p-4 py-2 text-sm font-medium">
            <Link className="tag" to="/?tag=latest">
                Latest
            </Link>
            <Link className="tag" to="/?tag=news">
                News
            </Link>
            <Link className="tag" to="/?tag=world">
                World
            </Link>
            <Link className="tag" to="/?tag=tech">
                Tech
            </Link>
        </div>
    )
}

export default TagRibbion
