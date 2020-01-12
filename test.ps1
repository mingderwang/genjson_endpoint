param (
    [Parameter(Mandatory = $true)]
    $filePath
)
try {
[console]::InputEncoding = [System.Text.Encoding]::GetEncoding(950)
$OutputEncoding = [console]::OutputEncoding = [System.Text.Encoding]::GetEncoding(65001)


$srcEnc = [System.Text.Encoding]::GetEncoding("big5")
$destEnc = [System.Text.Encoding]::GetEncoding("utf-8")
$test = "事務局彙整"
$test2 = "      ��� C:\Users\ttt\ming\src\genjson_endpoint\test.ps1:9 �r��:9 ���z���϶��������w�q���ʤ� '}'�C"
$newfilePath = $($destEnc.GetString($srcEnc.GetBytes($test)))
$testfile = "utils/test/事務局彙整.pptx"

write-host $filePath;
write-host $test;
write-host $newfilePath;
write-host $testfile
Get-Acl $($destEnc.GetString($srcEnc.GetBytes($filePath)))

}
catch {
    $_.Exception
}
