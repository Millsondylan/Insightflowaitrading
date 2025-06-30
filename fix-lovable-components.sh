#!/bin/bash

# Find all UI component .lovable.tsx files that don't have the compatibility export
FILES=$(find src/components -name "*.lovable.tsx" | xargs grep -L "export const lovable" 2>/dev/null)

# Add the compatibility export to each file
for FILE in $FILES; do
  echo "Fixing $FILE..."
  
  # Extract the component name from the filename
  COMPONENT_NAME=$(basename "${FILE%.*}" | sed 's/\.lovable//')
  
  # Check if the file already has a default export
  HAS_DEFAULT_EXPORT=$(grep -c "export default" "$FILE" || echo "0")
  
  # Add the lovable export
  cat >> "$FILE" << EOF

// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};
EOF

  # Add default export only if it doesn't exist already
  if [ "$HAS_DEFAULT_EXPORT" -eq "0" ]; then
    echo -e "\nexport default $COMPONENT_NAME;" >> "$FILE"
  fi
done

echo "Completed adding Lovable.dev compatibility exports to UI components!"
