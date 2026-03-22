---@param Bridge Bridge
---@param Config Config
return function(Bridge, Config)
  ---@param source number
  ---@return boolean
  function Bridge.hasPermission(source)
    return IsPlayerAceAllowed(tostring(source), Config.acePermission)
  end
end
