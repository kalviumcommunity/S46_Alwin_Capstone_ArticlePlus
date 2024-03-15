import { useSignals } from "@preact/signals-react/runtime"

function Read() {
    useSignals()

    return (
        <div className="container flex-col">
            <span>Hello, Readers👋</span>
        </div>
    )
}

export default Read
