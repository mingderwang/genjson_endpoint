param (
    [Parameter(Mandatory = $true)]
    $filePath
)
try {
	Get-Acl $filePath | Select-Object -Property Owner, Group, AccessToString, Access | ConvertTo-Json
}
catch {
    $_.Exception
}
