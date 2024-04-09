function DashboardAnalytics() {
    return (
        <div className="wrapper flex-col">
            <h1 className="text-2xl font-semibold">Analytics</h1>
            <div className="mt-8 flex w-full flex-col gap-3 border p-5 sm:w-96">
                <div className="flex w-full">
                    <span className="w-4/5">Followers</span>
                    <span className="w-1/5 text-center font-medium">100</span>
                </div>
                <div className="flex w-full">
                    <span className="w-4/5">Subscribers</span>
                    <span className="w-1/5 text-center font-medium">30</span>
                </div>
                <div className="flex w-full">
                    <span className="w-4/5">Views in last 1 month</span>
                    <span className="w-1/5 text-center font-medium">482</span>
                </div>
            </div>
        </div>
    )
}

export default DashboardAnalytics
