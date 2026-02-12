import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-black transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ECD06F] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#ECD06F] text-black hover:opacity-90 active:scale-[0.98]",
        secondary:
          "bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-[0.98]",
        accent:
          "bg-[#ECD06F]/10 text-[#ECD06F] border border-[#ECD06F]/20 hover:bg-[#ECD06F]/20 active:scale-[0.98]",
        outline:
          "border border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-[#ECD06F]/30",
        ghost:
          "text-white/60 hover:bg-white/10 hover:text-white",
        link:
          "text-[#ECD06F] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-full",
        sm: "h-9 rounded-full px-3",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10 rounded-full",
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
