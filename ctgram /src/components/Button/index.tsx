import type React from "react";

type Props = React.ComponentProps<"button"> & {
    isLoading?: boolean
}

export function Button({ children, isLoading, type = "button", ...rest }: Props) {
    return (
        <button type={type} disabled={isLoading} className=" flex items-center justify-center w-50 h-10 bg-orange-500
         rounded-md text-white cursor-pointer hover:bg-orange-300 transition ease-linear disabled:opacity-50 disabled:cursor-auto"{...rest}>
            {children}
        </button>
    )
}