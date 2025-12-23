import re
import os
import glob

# Find all route files with dynamic segments
route_files = glob.glob("app/api/**/[*]*/route.ts", recursive=True)

for filepath in route_files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    
    # Fix function signatures with params
    # Match patterns like { params }: { params: { id: string } }
    content = re.sub(
        r'\{ params \}: \{ params: \{ ([^}]+) \} \}',
        r'{ params }: { params: Promise<{ \1 }> }',
        content
    )
    
    # Add const { id } = await params to functions that need it
    # Only add if not already present
    lines = content.split('\n')
    new_lines = []
    i = 0
    while i < len(lines):
        new_lines.append(lines[i])
        
        # Check if this line is a function def with params
        if 'async function' in lines[i] and '{ params }' in lines[i]:
            # Check if next few lines already have await params
            has_await = any('await params' in lines[j] for j in range(min(i+1, i+5), min(len(lines), i+10)))
            if not has_await:
                # Look for the try { line
                if i+1 < len(lines) and 'try {' in lines[i+1]:
                    i += 1
                    new_lines.append(lines[i])
                    # Add the await params line
                    indent = '    '
                    # Extract what params should contain from function signature
                    param_match = re.search(r'{ params: Promise<\{ ([^}]+) \}', lines[i-1])
                    if param_match:
                        param_names = param_match.group(1)
                        # Extract just the names (id, slug, email, etc.)
                        names = re.findall(r'(\w+):', param_names)
                        if names:
                            new_lines.append(f'{indent}const {{ {", ".join(names)} }} = await params')
        
        i += 1
    
    content = '\n'.join(new_lines)
    
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed: {filepath}")

print("Done!")
