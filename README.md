# Get module defintion version action

This action determines the version number from the module definition file and returns it as the version number.

## Inputs

## `module-definition-file`

**Required** The desitnation of the module definition file. Default `"./module-definition/info.json"`.

## `fallback-version`

The fallback version. Default `2.0.0`

## `alternative-major-version`

The alternative major version. Default ``

## `alternative-minor-version`

The alternative minor version. Default ``

## `alternative-build-version`

The alternative build version. Default ``

## Outputs

## `version`

The version number of the module. If the version number is not recognized, the fallback with the date prefix YYMM is used.

## Example usage

```yml
uses: actiwaredevelopment/action-io-get-module-version@v0.2
with:
  module-definition-file: './module-definition/info.json'
  fallback-version: '2.0.0'
```
