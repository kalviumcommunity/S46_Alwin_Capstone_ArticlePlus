import { toast } from "sonner"

function ToastAlert({ message }) {
    return (
        <div className="flex w-80 items-center justify-between gap-2 rounded-lg border bg-gray-50 px-4 py-2.5">
            <h1 className="text-sm font-medium">{message}</h1>
            <button
                className="w-fit rounded-full border p-1.5 text-sm font-medium"
                onClick={() => toast.dismiss(t)}>
                <svg
                    className="h-4 w-4 fill-black/60 hover:fill-black"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    )
}

export default ToastAlert
