# Tester la présence de nvm
try{
   nvm > $null
}
catch {
   Write-Host "nvm ne semble pas être installé. Il peut être téléchargé via ce lien https://github.com/coreybutler/nvm-windows/releases"
   exit
}

try {
   node --version > $null
}
catch
{
   $actualNodeVersion = 'null'
}

# Cette fonction permet de garder seulement les nombres et les . d'un numéro de version
# Ça permet de retirer le « v » quand on obtient le numéro de version avec node --version,
# mais aussi de retirer les indicateurs sémantiques comme >, ~ ou x.
Function TrimVersion
{
   param ($Version)

   $versionPattern = '(\d+(?:\.\d+){0,3})' # La regexp permet d'enlever le v au début de la version
   $trimmed = ($Version | Select-String -Pattern $versionPattern).Matches[0].ToString()
   return $trimmed
}

$currentDir = $PSScriptRoot;
$sourceDir = Join-Path -Path $currentDir -ChildPath '../'

$packageJsonPath = Join-Path -Path $sourceDir -ChildPath 'package.json'
$packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
$expectedNodeVersion = $packageJson.engines.node

if ($actualNodeVersion -eq 'null') 
{
   $isValid = $False
}
else
{
   $actualNodeVersion = TrimVersion -Version (node --version)

   # Vérifier la version sémantiquement.
   # On utilise le package npm semver parce qu'il ne semble pas y avoir de façon simple de le faire en powershell
   $validVersion = (npx -yes semver -r $expectedNodeVersion $actualNodeVersion)
   Write-Host "Résultat semver : <${validVersion}>"
   $isValid = $validVersion -eq $actualNodeVersion
}

if ($isValid -eq $True) 
{
   Write-host "La version actuelle de node ${actualNodeVersion} peut être utilisée parce qu'elle répond à la version requise $expectedNodeVersion"
}
else 
{
   Write-Host "La version actuelle de node ($actualNodeVersion) ne correspond pas à la version requise ($expectedNodeVersion)"

   $trimmedVersion = TrimVersion -Version $expectedNodeVersion
   # On va permettre à l'utilisateur d'utiliser une version plus grande qui fonctionnerait s'il le désire
   $userChosenVersion = (Read-host -Prompt "La version $trimmedVersion sera installée, vous pouvez indiquer une version différente si désiré, ou appuyer sur ENTER").Trim()
   if ($userChosenVersion -eq '') {
      $userChosenVersion = $trimmedVersion
   }

   $installedVersions = (nvm list);

   # Vérifier si la version requise est déjà installée
   $isRequiredVersionInstalled = ($installedVersions | Where-Object { $_.Contains($userChosenVersion)}).Count -gt 0
   if ($isRequiredVersionInstalled) {
      Write-Host "La version requise est disponible via nvm, nous allons l'utiliser"
      nvm use $userChosenVersion
   } else {
      Write-Host "La version requise n'est pas disponible via nvm, nous allons l'installer"

      nvm install $userChosenVersion
      nvm use $userChosenVersion
   }

   # le changement de version (nvm use) peut prendre quelques millisecondes à  se faire.
   # Voir https://github.com/coreybutler/nvm-windows/wiki/Common-Issues#delayed-changes
   Start-Sleep -Seconds 1

   # Afficher l'information sur ce qu'on vient d'installer
   $usedNode = (nvm current)
   $usedNpm = (npm --version)
   Write-Host "Versions maintenant utilisées :
   node : $usedNode
   npm: $usedNpm"
}