import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    /></HTMLDivElement>
  )
}

export { Skeleton }


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
