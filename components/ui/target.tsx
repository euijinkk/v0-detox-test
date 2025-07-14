import * as React from "react"
import { Circle } from "lucide-react"

const Target = React.forwardRef<React.ElementRef<typeof Circle>, React.ComponentPropsWithoutRef<typeof Circle>>(
  ({ className, ...props }, ref) => <Circle ref={ref} className={className} {...props} />,
)
Target.displayName = "Target"

export default Target
