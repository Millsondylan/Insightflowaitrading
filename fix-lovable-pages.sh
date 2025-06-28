#!/bin/bash

# Find all page .lovable.tsx files that don't have the compatibility export
FILES=$(find src/pages -name "*.lovable.tsx" | xargs grep -L "export const lovable" 2>/dev/null)

# Add the compatibility export to each file
for FILE in $FILES; do
  echo "Fixing $FILE..."
  cat >> "$FILE" << 'EOF'

// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default $(basename "${FILE%.*}" | sed 's/\.lovable//');
EOF
done

echo "Completed adding Lovable.dev compatibility exports to page components!"
