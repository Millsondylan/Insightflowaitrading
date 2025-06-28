#!/bin/bash

# Fix the remaining files
FILES="src/contexts/ThemeContext.lovable.tsx src/App.lovable.tsx src/hooks/use-auth.lovable.tsx src/hooks/use-scroll-reveal.lovable.tsx src/hooks/use-mobile.lovable.tsx src/lib/journal/generateReflection.lovable.tsx src/lib/subscription/payments.lovable.tsx src/lib/markets/sentiment-analyzer.lovable.tsx src/lib/strategy/ml-optimizer.lovable.tsx src/lovable-demo/LovableDemo-SelfContained.lovable.tsx src/lovable-demo/components/TradingForm.lovable.tsx src/lovable-demo/components/Button.lovable.tsx src/lovable-demo/LovableDemo.lovable.tsx src/lovable-demo/index.lovable.tsx"

# Add the compatibility export to each file
for FILE in $FILES; do
  echo "Fixing $FILE..."
  
  # Extract the component name from the filename
  BASENAME=$(basename "$FILE")
  COMPONENT_NAME=${BASENAME%.*}
  COMPONENT_NAME=${COMPONENT_NAME%.lovable}
  
  # Add the lovable export
  cat >> "$FILE" << EOF

// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default $COMPONENT_NAME;
EOF
done

echo "Completed fixing remaining Lovable components!"
