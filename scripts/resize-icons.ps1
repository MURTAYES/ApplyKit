Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Sam\.gemini\antigravity-ide\brain\29266bec-6f93-40e5-994e-11947b597077\.user_uploaded\media_1790954391972.png"
if (-not (Test-Path $srcPath)) {
    Write-Error "Source file not found: $srcPath"
    exit 1
}

$src = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Source Image dimensions: $($src.Width)x$($src.Height)"

$targetDirs = @(
    "G:\code\Donna\public\icons",
    "G:\code\Donna\.output\chrome-mv3\icons"
)

foreach ($dir in $targetDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
}

$sizes = @(16, 32, 48, 128)

foreach ($sz in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $sz, $sz
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($src, 0, 0, $sz, $sz)
    $g.Dispose()

    foreach ($dir in $targetDirs) {
        $outPath = Join-Path $dir "icon-$sz.png"
        $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
        Write-Host "Wrote: $outPath ($((Get-Item $outPath).Length) bytes)"
    }

    $bmp.Dispose()
}

$src.Dispose()
Write-Host "Icon generation complete!"
