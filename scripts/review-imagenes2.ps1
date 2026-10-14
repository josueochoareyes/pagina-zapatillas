Add-Type -AssemblyName System.Drawing
$root = 'C:\pagina-zapatillas'
$files = Get-ChildItem -LiteralPath "$root\Imagenes2\Imagenes2" -Recurse -File | Sort-Object FullName
New-Item -ItemType Directory -Force -Path "$root\output\imagenes2" | Out-Null
$files.FullName | ConvertTo-Json | Set-Content -Encoding UTF8 "$root\output\imagenes2\files.json"
for ($start = 0; $start -lt $files.Count; $start += 16) {
  $bitmap = New-Object System.Drawing.Bitmap 1200,1440
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::White)
  $font = New-Object System.Drawing.Font 'Arial',10
  for ($j = 0; $j -lt 16 -and ($start+$j) -lt $files.Count; $j++) {
    $file = $files[$start+$j]
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    $x = ($j % 4)*300
    $y = [math]::Floor($j/4)*360
    $scale = [math]::Min(280/$img.Width,270/$img.Height)
    $graphics.DrawImage($img,[int]($x+(300-$img.Width*$scale)/2),[int]$y,[int]($img.Width*$scale),[int]($img.Height*$scale))
    $label = "$($start+$j): " + $file.FullName.Substring(("$root\Imagenes2\Imagenes2\").Length)
    $rect = New-Object System.Drawing.RectangleF $x,($y+275),295,85
    $graphics.DrawString($label,$font,[System.Drawing.Brushes]::Black,$rect)
    $img.Dispose()
  }
  $bitmap.Save("$root\output\imagenes2\sheet-$start.png")
  $graphics.Dispose()
  $bitmap.Dispose()
}
