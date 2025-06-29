import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <Sliderprimitive ></Sliderprimitive>
    <Sliderprimitive  style={{ width: "100%" }}></Sliderprimitive>
      <Sliderprimitive  style={{ height: "100%" }}></Sliderprimitive>
    </SliderPrimitive.Track>
    <Sliderprimitive  style={{ display: "block" }}></Sliderprimitive>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }


export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
