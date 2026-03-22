---@type Config
local Config = lib.require("script.shared.config.main")

---@class Logger
local Logger = {}

---@type table<LogEvent, number>
local colors = {
  CreateRefund = 3066993,
  ClaimRefund = 3447003,
  PartialClaim = 15105570,
}

---@param event LogEvent
---@param data LogData
local function sendDiscordWebhook(event, data)
  if not Config.logging.discord.enabled or Config.logging.discord.webhook == "" then return end

  local fields = {
    { name = "Player",  value = ("%s (ID: %s)"):format(data.steamName or "Unknown", data.source or "N/A"), inline = true },
    { name = "License", value = data.license or "N/A",                                                     inline = true },
    { name = "Code",    value = "`" .. (data.code or "N/A") .. "`",                                        inline = true },
  }

  if data.discord then
    fields[#fields + 1] = { name = "Discord", value = data.discord, inline = true }
  end

  if data.steam then
    fields[#fields + 1] = { name = "Steam", value = data.steam, inline = true }
  end

  local function addItemField(items, label)
    if not items or #items == 0 then return end
    local lines = {}
    for _, item in ipairs(items) do
      lines[#lines + 1] = ("- **%s** x%d"):format(item.label or item.name, item.count)
    end
    fields[#fields + 1] = { name = label, value = table.concat(lines, "\n"), inline = false }
  end

  addItemField(data.items, "Items")
  addItemField(data.delivered, "Delivered")
  addItemField(data.remaining, "Remaining")

  if data.maxUses then
    fields[#fields + 1] = { name = "Max Uses", value = tostring(data.maxUses == 0 and "Unlimited" or data.maxUses), inline = true }
  end

  if data.expiresAt then
    fields[#fields + 1] = { name = "Expires", value = data.expiresAt, inline = true }
  end

  local embed = {
    title = event,
    color = colors[event] or 0,
    fields = fields,
    timestamp = os.date("!%Y-%m-%dT%H:%M:%SZ"),
    footer = { text = "pf_refund" },
  }

  PerformHttpRequest(Config.logging.discord.webhook, function() end, "POST",
    json.encode({ embeds = { embed } }),
    { ["Content-Type"] = "application/json" }
  )
end

---@param event LogEvent
---@param data LogData
local function sendOxLibLog(event, data)
  if not Config.logging.oxLib.enabled then return end
  lib.logger(data.source, event, json.encode(data))
end

---@param event LogEvent
---@param data LogData
function Logger.log(event, data)
  sendOxLibLog(event, data)
  sendDiscordWebhook(event, data)
end

return Logger
