---@param Bridge Bridge
---@param Config Config
return function(Bridge, Config)
  local QBCore = exports["qb-core"]:GetCoreObject()

  ---@param source number
  ---@return boolean
  function Bridge.hasPermission(source)
    if Config.permissionType == "ace" then
      return IsPlayerAceAllowed(tostring(source), Config.acePermission)
    end
    local player = QBCore.Functions.GetPlayer(source)
    if not player then return false end
    return lib.table.contains(Config.allowedGroups, player.PlayerData.group)
  end
end
