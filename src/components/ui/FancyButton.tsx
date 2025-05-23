import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface FancyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

const FancyButton = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
    ({ className, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <div
                className={cn(
                    // Outer "border" effect via background gradient
                    "w-fit rounded-lg p-[1.5px]",
                    "bg-gradient-to-b from-[#7A66F5] via-[#5F46EB] to-[#3F29C7]",
                    "shadow-sm"
                )}
            >
                <Comp
                    className={cn(
                        "rounded-md px-6 py-2 text-white font-semibold",
                        "bg-gradient-to-b from-[#6A4DFC] via-[#5A3DFD] to-[#5232FC]",
                        "text-center transition-shadow hover:shadow-md",
                        "focus:outline-none focus:ring-2 focus:ring-[#8F7BFF]",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);

FancyButton.displayName = "FancyButton";

export { FancyButton };
