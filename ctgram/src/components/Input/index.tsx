import type React from "react";

type Props = React.ComponentProps<"input"> & {
    legend?: string
}
export function Input({ legend, type = "text", ...rest }: Props) {
    return (
        <fieldset className="flex max-h-20 text-gray-600 focus-within:text-orange-500">
            {legend && <legend className="text-inherit">
                {legend}
            </legend>}

        <input {...rest} type = {type} className="w-full h-10 border border-gray-500 px-4 bg-transparent outline-none rounded-md focus:border-2 focus:border-orange-100 placeholder:orange-100"/>
        </fieldset>
    )
}