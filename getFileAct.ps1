param (
    [Parameter(Mandatory = $true)]
    $filePath
)
try {
[console]::InputEncoding = [System.Text.Encoding]::GetEncoding(950)
$OutputEncoding = [console]::OutputEncoding = [System.Text.Encoding]::GetEncoding(65001)

$srcEnc = [System.Text.Encoding]::GetEncoding("big5")
$destEnc = [System.Text.Encoding]::GetEncoding("utf-8")
write-host $($destEnc.GetString($srcEnc.GetBytes($filePath)));
Get-Acl $($destEnc.GetString($srcEnc.GetBytes($filePath))) | Select-Object -Property Owner, Group, AccessToString, Access | ConvertTo-Json
}
catch {
    $_.Exception
}
