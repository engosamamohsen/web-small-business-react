# PowerShell script to replace Next.js imports with Astro-compatible imports

$files = Get-ChildItem -Path "src" -Include *.tsx,*.ts,*.jsx,*.js -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    # Replace next/link imports
    if ($content -match 'import\s+Link\s+from\s+["\']next/link["\']') {
        $content = $content -replace 'import\s+Link\s+from\s+["\']next/link["\']', 'import Link from "@/components/common/Link"'
        $modified = $true
    }
    
    # Replace next/image imports
    if ($content -match 'import\s+Image\s+from\s+["\']next/image["\']') {
        $content = $content -replace 'import\s+Image\s+from\s+["\']next/image["\']', 'import Image from "@/components/common/Image"'
        $modified = $true
    }
    
    # Replace next/navigation imports - useRouter
    if ($content -match 'import\s+\{[^}]*useRouter[^}]*\}\s+from\s+["\']next/navigation["\']') {
        $content = $content -replace 'import\s+\{([^}]*)\}\s+from\s+["\']next/navigation["\']', 'import { $1 } from "@/lib/navigation"'
        $modified = $true
    }
    
    # Replace next/headers imports (remove them, will handle differently)
    if ($content -match 'import\s+\{[^}]*cookies[^}]*\}\s+from\s+["\']next/headers["\']') {
        $content = $content -replace 'import\s+\{[^}]*cookies[^}]*\}\s+from\s+["\']next/headers["\']\s*;?\s*\n', ''
        $modified = $true
    }
    
    # Replace notFound import (remove it)
    if ($content -match 'import\s+\{[^}]*notFound[^}]*\}\s+from\s+["\']next/navigation["\']') {
        $content = $content -replace 'import\s+\{[^}]*notFound[^}]*\}\s+from\s+["\']next/navigation["\']\s*;?\s*\n', ''
        $modified = $true
    }
    
    # Replace Metadata import (remove it)
    if ($content -match 'import\s+.*Metadata.*from\s+["\']next["\']') {
        $content = $content -replace 'import\s+.*Metadata.*from\s+["\']next["\']\s*;?\s*\n', ''
        $modified = $true
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "Import replacement complete!"
