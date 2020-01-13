param (
    [Parameter(Mandatory = $true)]
    $filePath
)
try {
[console]::InputEncoding = [System.Text.Encoding]::GetEncoding(950)

Get-Acl $filePath | Select-Object -Property Owner, Group, AccessToString, Access | ConvertTo-Json;

}
catch {
    $_.Exception
}
