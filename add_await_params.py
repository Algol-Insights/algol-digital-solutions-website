import re
import glob

files = glob.glob("app/api/**/[*]*/route.ts", recursive=True)

for filepath in files:
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    modified = False
    new_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        new_lines.append(line)
        
        # Check if this is a function line with params: Promise
        if 'async function' in line and '{ params }' in line and 'Promise' in line:
            # Look ahead for try {
            if i+1 < len(lines) and 'try {' in lines[i+1]:
                i += 1
                new_lines.append(lines[i])
                
                # Extract param names from function signature
                match = re.search(r'{ params: Promise<\{ ([^}]+) \}', line)
                if match:
                    params_str = match.group(1)
                    names = re.findall(r'(\w+):', params_str)
                    if names:
                        indent = '    '
                        await_line = f'{indent}const {{ {", ".join(names)} }} = await params\n'
                        # Check if next line already has await
                        if i+1 < len(lines) and 'await params' not in lines[i+1]:
                            new_lines.append(await_line)
                            modified = True
        
        i += 1
    
    if modified:
        with open(filepath, 'w') as f:
            f.writelines(new_lines)
        print(f"Added await: {filepath}")

print("Done!")
