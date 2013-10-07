$lines = Get-Content .\undermykeel.appcache
$lines[1] = "#" + (Get-Date).ToString()
$newappCache = New-Item -Name "undermykeel.appcache" -type file -Force -Verbose
$lines |ForEach-Object {Add-Content -Value $_ -Path $newappCache} 