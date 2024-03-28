import { Link } from "react-router-dom"

function TagRibbion() {
    return (
        <div className="flex justify-start border-b px-4 py-2 text-xs font-medium text-gray-700 sm:px-8 lg:px-16">
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
