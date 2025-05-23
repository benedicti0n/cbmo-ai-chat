import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "", // handled manually
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-6 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    if (variant === "default") {
      return (
        <div className="group w-fit rounded-lg p-[1.5px] bg-gradient-to-b from-[#3F29C7] via-[#7D70FF] to-[#3F29C7] shadow-sm">
          <div className="relative rounded-md overflow-hidden bg-gradient-to-b from-[#6A4DFC] via-[#5A3DFD] to-[#5232FC]">
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[#7D70FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out pointer-events-none z-0" />

            <Comp
              className={cn(
                "relative z-10 text-white font-semibold text-sm h-9 px-6 py-2 transition-shadow duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#8F7BFF]",
                buttonVariants({ size }),
                className
              )}
              ref={ref}
              {...props}
            />
          </div>
        </div>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
export { Button, buttonVariants }
