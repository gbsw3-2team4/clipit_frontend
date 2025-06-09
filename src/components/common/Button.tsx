import { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const buttonVariants = cva("h-12 px-6 text-lg rounded transition-all", {
  variants: {
    variant: {
      black:
        "bg-[var(--primary-black)] text-[var(--primary-white)] hover:-translate-y-1 hover:text-[var(--bg-sub-color)] rounded-full cursor-pointer",
      outline:
        "bg-[var(--bg-color)] text-[var(--text-color)] border border-[var(--border-color)] hover:bg-[var(--bg-sub-color)] hover:-translate-y-1 rounded-full cursor-pointer",
      secondary:
        "bg-[var(--bg-color)] text-[var(--text-color)] border border-[var(--border-color)] hover:bg-[var(--bg-sub-color)] rounded-full cursor-pointer",
      primary:
        "bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)] rounded-full cursor-pointer",
    },
    fullWidth: {
      true: "w-full",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    fullWidth: false,
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = ({
  variant,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(buttonVariants({ variant, fullWidth }), className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
