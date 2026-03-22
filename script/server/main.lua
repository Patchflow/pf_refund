---@type Bridge
local Bridge = lib.require("script.server.modules.bridge")
---@type Logger
local Logger = lib.require("script.server.modules.logger")
---@type Config
local Config = lib.require("script.shared.config.main")

MySQL.ready(function()
  MySQL.query([[
    CREATE TABLE IF NOT EXISTS `pf_refunds` (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `code` VARCHAR(16) NOT NULL UNIQUE,
      `items` JSON NOT NULL,
      `max_uses` INT NOT NULL DEFAULT 1,
      `times_used` INT NOT NULL DEFAULT 0,
      `expires_at` DATETIME NULL,
      `created_by` VARCHAR(64) NOT NULL,
      `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  ]])

  MySQL.query([[
    CREATE TABLE IF NOT EXISTS `pf_refund_claims` (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `refund_code` VARCHAR(16) NOT NULL,
      `player_identifier` VARCHAR(64) NOT NULL,
      `remaining_items` JSON NULL,
      `claimed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY `uk_code_player` (`refund_code`, `player_identifier`)
    )
  ]])
end)

local CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
local CODE_LENGTH = 16

---@type table<number, true>
local claimLocks = {}

AddEventHandler("playerDropped", function()
  claimLocks[source] = nil
end)

---@return string
local function generateCode()
  local code
  repeat
    local chars = {}
    for i = 1, CODE_LENGTH do
      local idx = math.random(1, #CHARSET)
      chars[i] = CHARSET:sub(idx, idx)
    end
    code = table.concat(chars)
    local existing = MySQL.scalar.await("SELECT COUNT(*) FROM `pf_refunds` WHERE `code` = ?", { code })
  until existing == 0
  return code
end

---@type table<string, number>
local DURATIONS = {
  ["1h"] = 3600,
  ["6h"] = 21600,
  ["12h"] = 43200,
  ["24h"] = 86400,
  ["48h"] = 172800,
  ["7d"] = 604800,
}

---@param expiresIn? string
---@return string?
local function parseExpiry(expiresIn)
  if not expiresIn then return nil end
  local seconds = DURATIONS[expiresIn] or tonumber(expiresIn)
  if not seconds or seconds <= 0 or seconds > 2592000 then return nil end
  return os.date("%Y-%m-%d %H:%M:%S", os.time() + seconds) --[[@as string]]
end

---@param source number
---@param extra? table
---@return LogData
local function buildLogData(source, extra)
  local identifiers = Bridge.getIdentifiers(source)
  ---@type LogData
  local data = {
    source = source,
    steamName = GetPlayerName(source),
    license = identifiers.license,
    discord = identifiers.discord,
    steam = identifiers.steam,
  }
  if extra then
    for k, v in pairs(extra) do
      data[k] = v
    end
  end
  return data
end

---@type table<string, OxItem>?
local itemRegistry
---@type OxItem[]?
local itemListCache

---@return table<string, OxItem>
local function getItemRegistry()
  if not itemRegistry then
    itemRegistry = {}
    local oxItems = exports.ox_inventory:Items()
    if oxItems then
      for name, data in pairs(oxItems) do
        itemRegistry[name] = {
          name = name,
          label = data.label,
          image = data.client and data.client.image or (name .. ".png"),
          weight = data.weight or 0,
        }
      end
    end
  end
  return itemRegistry
end

---@return OxItem[]
local function getItems()
  if not itemListCache then
    local registry = getItemRegistry()
    ---@type OxItem[]
    local items = {}
    for _, item in pairs(registry) do
      items[#items + 1] = item
    end
    table.sort(items, function(a, b) return a.label < b.label end)
    itemListCache = items
  end
  return itemListCache
end

lib.callback.register("pf_refund:getItems", function(source)
  if not Bridge.hasPermission(source) then return {} end
  return getItems()
end)

---@param data CreateRefundData
---@return RefundItem[]?
local function validateItems(data)
  local items = data.items
  if type(items) ~= "table" or #items == 0 or #items > Config.limits.maxItemsPerRefund then return nil end

  local registry = getItemRegistry()
  ---@type RefundItem[]
  local validated = {}

  for _, item in ipairs(items) do
    if type(item) ~= "table" then return nil end
    if type(item.name) ~= "string" then return nil end

    local oxItem = registry[item.name]
    if not oxItem then return nil end

    local count = tonumber(item.count)
    if not count or count < 1 or count > Config.limits.maxItemCount or count ~= math.floor(count) then return nil end

    local metadata
    if item.metadata ~= nil then
      if type(item.metadata) ~= "table" then return nil end
      local hasKeys = false
      for k, v in pairs(item.metadata) do
        if type(k) ~= "string" or type(v) ~= "string" then return nil end
        hasKeys = true
      end
      if hasKeys then metadata = item.metadata end
    end

    validated[#validated + 1] = {
      name = item.name,
      label = oxItem.label,
      count = count,
      metadata = metadata,
    }
  end

  return validated
end

---@param source number
---@param data CreateRefundData
---@return string | false
lib.callback.register("pf_refund:createRefund", function(source, data)
  if not Bridge.hasPermission(source) then return false end

  local items = validateItems(data)
  if not items then return false end

  local maxUses = math.floor(tonumber(data.maxUses) or 1)
  if maxUses < 0 or maxUses > Config.limits.maxUsesCap then maxUses = 1 end

  local expiresAt = parseExpiry(data.expiresIn)

  local code = generateCode()
  local identifier = Bridge.getIdentifier(source)

  MySQL.insert.await(
    "INSERT INTO `pf_refunds` (`code`, `items`, `max_uses`, `expires_at`, `created_by`) VALUES (?, ?, ?, ?, ?)",
    { code, json.encode(items), maxUses, expiresAt, identifier }
  )

  Logger.log("CreateRefund", buildLogData(source, {
    code = code,
    items = items,
    maxUses = maxUses,
    expiresAt = expiresAt or "Never",
  }))

  return code
end)

---@param code string
---@param playerIdentifier string
---@return ValidateResult?, string?
local function validateRefund(code, playerIdentifier)
  ---@type RefundRecord?
  local refund = MySQL.single.await(
    "SELECT *, (expires_at IS NOT NULL AND expires_at < NOW()) AS is_expired FROM `pf_refunds` WHERE `code` = ?",
    { code }
  )
  if not refund then return nil, "invalid_code" end

  if refund.is_expired == 1 then
    return nil, "code_expired"
  end

  ---@type ClaimRecord?
  local existingClaim = MySQL.single.await(
    "SELECT * FROM `pf_refund_claims` WHERE `refund_code` = ? AND `player_identifier` = ?",
    { code, playerIdentifier }
  )

  if existingClaim then
    if not existingClaim.remaining_items then
      return nil, "code_used"
    end
    return { refund = refund, items = json.decode(existingClaim.remaining_items), isResume = true }
  end

  if refund.max_uses > 0 and refund.times_used >= refund.max_uses then
    return nil, "code_used"
  end

  return { refund = refund, items = json.decode(refund.items), isResume = false }
end

lib.addCommand(Config.commands.claimRefund, {
  help = locale("command_claim"),
  restricted = false,
  params = {
    { name = "code", type = "string", help = "Refund code" },
  },
}, function(source, args)
  local code = string.upper(args.code)
  local identifier = Bridge.getIdentifier(source)
  if not identifier then return end

  local result, err = validateRefund(code, identifier)
  if not result then
    return lib.notify(source, { description = locale(err --[[@as string]]), type = "error" })
  end

  TriggerClientEvent("pf_refund:openClaim", source, result.items, code, Config.imageUrl, Config.accentColor)
end)

---@param source number
---@param items RefundItem[]
---@return RefundItem[], RefundItem[]
local function deliverItems(source, items)
  ---@type RefundItem[]
  local delivered = {}
  ---@type RefundItem[]
  local remaining = {}

  for _, item in ipairs(items) do
    local toGive = item.count
    local given = 0

    for _ = 1, toGive do
      local canAdd = exports.ox_inventory:CanCarryItem(source, item.name, 1, item.metadata)
      if canAdd then
        exports.ox_inventory:AddItem(source, item.name, 1, item.metadata)
        given = given + 1
      else
        break
      end
    end

    if given > 0 then
      delivered[#delivered + 1] = { name = item.name, label = item.label, count = given, metadata = item.metadata }
    end
    local leftover = toGive - given
    if leftover > 0 then
      remaining[#remaining + 1] = { name = item.name, label = item.label, count = leftover, metadata = item.metadata }
    end
  end

  return delivered, remaining
end

---@param source number
---@param code string
---@param identifier string
---@return ClaimResult | false
local function processClaim(source, code, identifier)
  if claimLocks[source] then return false end
  claimLocks[source] = true

  local ok, ret = pcall(function()
    local result, _ = validateRefund(code, identifier)
    if not result then return false end

    if not result.isResume then
      local affected = MySQL.update.await(
        "UPDATE `pf_refunds` SET `times_used` = `times_used` + 1 WHERE `code` = ? AND (max_uses = 0 OR `times_used` < `max_uses`)",
        { code }
      )
      if affected == 0 then return false end
    end

    local delivered, remaining = deliverItems(source, result.items)

    if #delivered == 0 then
      if not result.isResume then
        MySQL.update.await(
          "UPDATE `pf_refunds` SET `times_used` = GREATEST(`times_used` - 1, 0) WHERE `code` = ?",
          { code }
        )
      end
      lib.notify(source, { description = locale("partial_claim"), type = "error" })
      return false
    end

    local hasRemaining = #remaining > 0

    if result.isResume then
      MySQL.update.await(
        "UPDATE `pf_refund_claims` SET `remaining_items` = ? WHERE `refund_code` = ? AND `player_identifier` = ?",
        { hasRemaining and json.encode(remaining) or nil, code, identifier }
      )
    else
      MySQL.insert.await(
        "INSERT INTO `pf_refund_claims` (`refund_code`, `player_identifier`, `remaining_items`) VALUES (?, ?, ?)",
        { code, identifier, hasRemaining and json.encode(remaining) or nil }
      )
    end

    ---@type LogEvent
    local event = hasRemaining and "PartialClaim" or "ClaimRefund"
    Logger.log(event, buildLogData(source, {
      code = code,
      items = result.items,
      delivered = delivered,
      remaining = hasRemaining and remaining or nil,
    }))

    if hasRemaining then
      lib.notify(source, { description = locale("partial_claim"), type = "warning" })
    else
      lib.notify(source, { description = locale("refund_claimed"), type = "success" })
    end

    return { success = true, partial = hasRemaining }
  end)

  claimLocks[source] = nil
  if not ok then return false end
  return ret
end

---@param source number
---@param data ConfirmClaimData
---@return ClaimResult | false
lib.callback.register("pf_refund:confirmClaim", function(source, data)
  if type(data.code) ~= "string" or #data.code ~= CODE_LENGTH then return false end
  local code = string.upper(data.code)
  local identifier = Bridge.getIdentifier(source)
  if not identifier then return false end

  return processClaim(source, code, identifier)
end)

---@param source number
---@param refundCode string
---@return boolean
local function refundPlayer(source, refundCode)
  if type(refundCode) ~= "string" then return false end
  local code = string.upper(refundCode)
  local identifier = Bridge.getIdentifier(source)
  if not identifier then return false end

  local result = processClaim(source, code, identifier)
  return result ~= false
end

---@param code string
---@return RefundRecord | false
local function checkCode(code)
  if type(code) ~= "string" then return false end
  code = string.upper(code)
  ---@type RefundRecord?
  local refund = MySQL.single.await(
    "SELECT *, (expires_at IS NOT NULL AND expires_at < NOW()) AS is_expired FROM `pf_refunds` WHERE `code` = ?",
    { code }
  )
  if not refund then return false end
  if refund.is_expired == 1 then return false end
  if refund.max_uses > 0 and refund.times_used >= refund.max_uses then return false end

  refund.items = json.decode(refund.items)
  return refund
end

exports("RefundPlayer", refundPlayer)
exports("CheckCode", checkCode)
