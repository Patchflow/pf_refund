---@type Config
return {
  framework = "auto",
  permissionType = "ace",
  acePermission = "pf_refund.admin",
  allowedGroups = { "admin", "god", "superadmin" },

  commands = {
    refund = "refund",
    claimRefund = "claimrefund",
  },

  accentColor = "blue",
  imageUrl = "nui://ox_inventory/web/images/",

  limits = {
    maxItemCount = 10000,
    maxItemsPerRefund = 5000,
    maxUsesCap = 1000,
  },

  logging = {
    oxLib = {
      enabled = false,
    },
    discord = {
      enabled = false,
      webhook = "",
    },
  },
}
