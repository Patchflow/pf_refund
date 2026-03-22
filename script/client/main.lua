local isOpen = false
local hasPermission = false

---@type Config
local Config = lib.require("script.shared.config.main")

local function closeNui()
  if not isOpen then return end
  isOpen = false
  SetNuiFocus(false, false)
  SendNUIMessage({ action = "CLOSE" })
end

AddEventHandler("ox_lib:setLocale", function()
  SendNUIMessage({
    action = "SET_LOCALES",
    data = { locales = lib.getLocales() }
  })
end)

RegisterNUICallback("READY", function(_, cb)
  cb({})
  local items = lib.callback.await("pf_refund:getItems", false)
  hasPermission = items and #items > 0
  SendNUIMessage({
    action = "INIT",
    data = {
      items = items or {},
      imageUrl = Config.imageUrl,
      accentColor = Config.accentColor,
      locales = lib.getLocales(),
    }
  })
end)

RegisterNUICallback("CLOSE_NUI", function(_, cb)
  closeNui()
  cb({})
end)

RegisterNUICallback("COPY_TO_CLIPBOARD", function(data, cb)
  SetNuiFocus(false, true)
  Wait(50)
  lib.setClipboard(data.text)
  Wait(50)
  SetNuiFocus(true, true)
  cb(1)
end)

---@param data CreateRefundData
---@param cb fun(result: string | false)
RegisterNUICallback("CREATE_REFUND", function(data, cb)
  local result = lib.callback.await("pf_refund:createRefund", false, data)
  cb(result or false)
end)

---@param data ConfirmClaimData
---@param cb fun(result: ClaimResult | false)
RegisterNUICallback("CONFIRM_CLAIM", function(data, cb)
  local result = lib.callback.await("pf_refund:confirmClaim", false, data)
  if result and result.success then
    closeNui()
  end
  cb(result or false)
end)

RegisterCommand(Config.commands.refund, function()
  if isOpen then return end
  if not hasPermission then
    return lib.notify({ description = locale("no_permission"), type = "error" })
  end
  isOpen = true
  SetNuiFocus(true, true)
  SendNUIMessage({ action = "OPEN_ADMIN" })
end, false)

---@param items RefundItem[]
---@param code string
---@param imageUrl string
---@param accentColor string
RegisterNetEvent("pf_refund:openClaim", function(items, code, imageUrl, accentColor)
  if isOpen then return end
  isOpen = true
  SetNuiFocus(true, true)
  SendNUIMessage({
    action = "OPEN_CLAIM",
    data = { items = items, code = code, imageUrl = imageUrl, accentColor = accentColor }
  })
end)
