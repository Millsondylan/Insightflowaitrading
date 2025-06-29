import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <sliderprimitive  >
    <sliderprimitive  style={{ width: "100%" }}>
      <sliderprimitive  style={{ height: "100%" }}>
    </SliderPrimitive.Track>
    <sliderprimitive  style={{ display: "block" }}>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

export const lovable = { component: true };
