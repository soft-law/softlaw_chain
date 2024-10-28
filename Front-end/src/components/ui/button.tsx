'use Client';
import React from "react";

 interface ButtonProps{
 
  cta: string;
  purpose: "submit" | "reset" | "button" | undefined
  // onClick: DOMAttributes<HTMLButtonElement>.onClick?: React.MouseEventHandler<HTMLButtonElement>;
  Style?: string;
  // onSubmit?: FormEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  icon?: React.ReactNode;
  // onClick?: MouseEventHandler<HTMLButtonElement>

}
 

export default function Button ({ cta = "Submit", purpose, 
  // onClick, onSubmit, 
  Style, disabled, icon }: ButtonProps)  {
  return (
    <div className="flex justify-center items-center">
      <button
        className={`bg-[#D0DFE4] rounded-[16px] px-[20px] py-[8px] w-[128px] items-center text-center min-[2000px]:py-[16px] min-[2000px]:tracking-[1px] min-[2000px]:text-3xl min-[2000px]:w-[200px] flex-shrink-0 border border-[#D0DFE4] text-[#1C1A11] hover:bg-[#FACC15]  hover:text-[#1C1A11] hover:border-none ${Style} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        type={purpose}
        // onClick={onClick} 
        // onSubmit={onSubmit} 
        disabled={disabled}
      >
        <div className="w-full flex justify-center items-center ">
          {cta}
          {icon}
        </div>
      </button>
    </div>
  );
};
























// import { Slot } from "@radix-ui/react-slot";
// import { cva, type VariantProps } from "class-variance-authority";

// import { cn } from "@/lib/utils";

// const buttonVariants = cva(
//   "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
//   {
//     variants: {
//       variant: {
//         default:
//           "bg-primary text-primary-foreground shadow hover:bg-primary/90",
//         destructive:
//           "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
//         outline:
//           "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
//         secondary:
//           "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
//         ghost: "hover:bg-accent hover:text-accent-foreground",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "px-4 py-2",
//         sm: "rounded-md px-3 text-xs",
//         lg: "rounded-md px-8",
//         icon: "h-9 w-9",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// );

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean;
//   bgColor?: string; //For background color
//   children: React.ReactNode; //Jsx text content
//   url?: string;
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     { className, variant, size, asChild = false, url, bgColor, children, ...props },
//     ref
//   ) => {
//     const Comp = asChild ? Slot : "button";
//     const handleClick = () => {
//       if (url) {
//         window.location.href = url; // Navigate to the URL if provided
//       }
//     };

//     return (
//       <Comp
//         className={cn(buttonVariants({ variant, size, className }), {
//           [bgColor || ""]: !!bgColor, //Apply specific background color if provided
//         })}
//         //cn connects class names
//         ref={ref}
//         {...props}
//         onClick={handleClick} //Attach the onClick handler
//       >
//         {children}   {/** Button text stays here */}
//       </Comp>
//     );
//   }
// );
// Button.displayName = "Button";

// export { Button, buttonVariants };
