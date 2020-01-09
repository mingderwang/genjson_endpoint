param (
    [Parameter(Mandatory = $true)]
    $filePath
)
try {
$Filesize = (Get-Item $filePath).length;
Write-Host "FileSize= $filesize";
Write-Host $filePath;

Get-Acl $filePath | Select-Object -Property Owner, Group, AccessToString | ConvertTo-Json;

$newfilePath = convert-path $filePath;
write-host $newfilePath;

Get-Acl $newfilePath | Select-Object -Property Owner, Group, AccessToString | ConvertTo-Json;
}
catch {
    $_.Exception
}
