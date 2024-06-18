function ComingSoonBanner() {
    return (
        <div className="mt-4 flex gap-3 rounded border border-yellow-200 bg-yellow-100 px-4 py-3">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokLinejoin="round">
                <polygon
                    points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"
                    className="stroke-yellow-800"
                />
                <line x1="12" x2="12" y1="8" y2="12" className="stroke-yellow-800" />
                <line x1="12" x2="12.01" y1="16" y2="16" className="stroke-yellow-800" />
            </svg>
            <span className="font-medium text-yellow-800">This feature is coming soon</span>
        </div>
    )
}

export default ComingSoonBanner
