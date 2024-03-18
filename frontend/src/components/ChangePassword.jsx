import * as Dialog from "@radix-ui/react-dialog"
import { useForm } from "react-hook-form"

function ChangePassword() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm()

    const onSubmit = (data) => {
        console.log(data)
    }

    return (
        <Dialog.Root>
            <div className="flex-1">
                <Dialog.Trigger className="w-fit rounded-full bg-black px-6 py-1 font-medium text-white">
                    Change password
                </Dialog.Trigger>
            </div>
            <Dialog.Portal>
                <Dialog.Overlay className="absolute inset-0 z-40 h-screen w-screen bg-black/50 opacity-100" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 transform  flex-col gap-3 rounded-sm bg-white px-6 py-10">
                    <Dialog.Title className="text-lg font-semibold">
                        Change password
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-gray-700">
                        Choose a strong password and don't reuse it for other
                        accounts.
                    </Dialog.Description>
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-1">
                            <label className="font-medium" htmlFor="password">
                                Password
                            </label>
                            <input
                                className={`input ${errors.password ? "border-red-500" : ""}`}
                                type="password"
                                autoComplete="new-password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password must be at least 8 characters long",
                                    },
                                })}
                            />
                            {errors.password && (
                                <span className="text-sm text-red-500">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label
                                className="font-medium"
                                htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                className={`input ${errors.confirmPassword ? "border-red-500" : ""}`}
                                type="password"
                                autoComplete="new-password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === watch("password") ||
                                        "Passwords do not match",
                                })}
                            />
                            {errors.confirmPassword && (
                                <span className="text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="ml-auto w-fit rounded-full bg-rose-500 px-6 py-1 font-semibold text-white ">
                            Update password
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default ChangePassword
