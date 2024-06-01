import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

function ArticleSettings() {
    return (
        <div className="flex gap-4 p-8">
            <div className="flex w-1/4 flex-col gap-4 rounded border bg-white p-3 pb-5">
                <div
                    className="h-48 w-full overflow-hidden rounded border"
                    style={{
                        backgroundImage: `url('https://media.newyorker.com/photos/65fc513fa938d6709b3d8be7/master/w_1920,c_limit/WonderCityOfTheWorld_p067a_web.jpg')`,
                        backgroundSize: "cover",
                    }}>
                    <img
                        className="h-full w-full object-contain"
                        src="https://media.newyorker.com/photos/65fc513fa938d6709b3d8be7/master/w_1920,c_limit/WonderCityOfTheWorld_p067a_web.jpg"
                        style={{ backdropFilter: "blur(50px)" }}
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <span className="line-clamp-2 font-serif text-xl font-medium">
                        Article title
                    </span>
                    <span className="mt-1 line-clamp-2 text-sm italic text-gray-800">
                        Article
                    </span>

                    <p className="mt-2 text-xs font-normal text-gray-500">
                        {new Date().toLocaleString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>

                    <div className="mt-3 flex flex-col gap-1">
                        <span className="font-medium">Article status:</span>
                        <span className="w-fit rounded-sm border border-red-200 bg-red-100 px-3 py-0.5 text-sm font-semibold text-red-800">
                            Draft
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex w-3/4 flex-col rounded border p-6">
                <h2 className="text-xl font-medium">Article settings</h2>
                <hr className="mt-4" />
                <div className="mt-4">
                    <div className="flex items-center gap-4">
                        <span className="font-medium">Access</span>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <div className="flex w-32 flex-shrink-0">
                                    <button className="flex items-center gap-1 rounded border bg-white py-1 pl-4 pr-2">
                                        <span>Free</span>
                                        <img
                                            className="h-4 w-4"
                                            src="/assets/icons/arrow-down.svg"
                                            alt=""
                                        />
                                    </button>
                                </div>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    className="w-32 divide-y rounded-md border-2 bg-white p-1 text-sm"
                                    sideOffset={5}>
                                    <DropdownMenu.Item className="flex gap-2 rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-gray-100">
                                        Free
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item className="flex items-center justify-between gap-2 rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-gray-100">
                                        Premium{" "}
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                className="h-5 text-green-500">
                                                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                                                <path d="M8 8h8" />
                                                <path d="M8 12h8" />
                                                <path d="m13 17-5-1h1a4 4 0 0 0 0-8" />
                                            </svg>
                                        </span>
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </div>
                </div>
                <div className="mt-auto flex w-full justify-end gap-2 border-t pt-4">
                    <button className="rounded border px-4 py-1 font-medium text-gray-800 hover:bg-gray-100">
                        Save as draft
                    </button>
                    <button className="rounded border bg-green-500 px-4 py-1 font-medium text-white hover:bg-green-600">
                        Publish
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ArticleSettings
