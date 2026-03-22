---@param Bridge Bridge
---@param Config Config
return function(Bridge, Config)
  local ESX = exports["es_extended"]:getSharedObject()

  ---@param source number
  ---@return boolean
  function Bridge.hasPermission(source)
    if Config.permissionType == "ace" then
      return IsPlayerAceAllowed(tostring(source), Config.acePermission)
    end
    local player = ESX.GetPlayerFromId(source)
    if not player then return false end
    return lib.table.contains(Config.allowedGroups, player.getGroup())
  end
end
