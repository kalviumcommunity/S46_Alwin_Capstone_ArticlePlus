import { Link } from "react-router-dom"

function TagRibbion({ isLoggedin }) {
    return (
        <div
            className={`${isLoggedin ? "sticky top-14 z-50 bg-white" : "sticky top-12 z-50 bg-white"} flex justify-start border-y px-4 py-3 text-sm font-medium sm:px-8 lg:px-16`}>
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
