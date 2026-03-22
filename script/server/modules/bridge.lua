---@type Config
local Config = lib.require("script.shared.config.main")

---@class Bridge
local Bridge = {}

---@return FrameworkType?
local function detectFramework()
  if Config.framework ~= "auto" then
    return Config.framework
  end

  if GetResourceState("qbx_core") ~= "missing" then
    return "qbox"
  elseif GetResourceState("qb-core") ~= "missing" then
    return "qbcore"
  elseif GetResourceState("es_extended") ~= "missing" then
    return "esx"
  end

  return nil
end

---@param source number
---@return boolean
function Bridge.hasPermission(source)
  if Config.permissionType == "ace" then
    return IsPlayerAceAllowed(tostring(source), Config.acePermission)
  end
  return false
end

---@param source number
---@return PlayerIdentifiers
function Bridge.getIdentifiers(source)
  ---@type PlayerIdentifiers
  local identifiers = { license = nil, discord = nil, steam = nil }
  for _, id in ipairs(GetPlayerIdentifiers(tostring(source))) do
    if string.find(id, "license:") then
      identifiers.license = id
    elseif string.find(id, "discord:") then
      identifiers.discord = id
    elseif string.find(id, "steam:") then
      identifiers.steam = id
    end
  end
  return identifiers
end

---@param source number
---@return string?
function Bridge.getIdentifier(source)
  return Bridge.getIdentifiers(source).license
end

local framework = detectFramework()
if framework then
  local init = lib.require(("script.server.frameworks.%s"):format(framework))
  init(Bridge, Config)
end

return Bridge
