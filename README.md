# pf_refund

A refund system for FiveM servers built by [Patchflow](https://patchflow.md/). Create refund codes with specific items and let players claim them in-game.

## Features

- **Refund Code Creation** — Admins create refund codes containing any items from ox_inventory with custom counts and metadata
- **Code Claiming** — Players redeem codes via command to receive items directly into their inventory
- **Partial Claims** — If a player's inventory is full, remaining items are saved and can be claimed later with the same code
- **Multi-Use Codes** — Codes can be configured for single or multiple uses with an optional cap
- **Expiry System** — Set codes to expire after a fixed duration (1h to 7d) or leave them permanent
- **Multi-Framework** — Supports QBCore, QBox, and ESX with automatic detection
- **Permission System** — ACE permissions or framework-based group checks
- **Localization** — Full locale support for all UI text and notifications (English and Danish included)
- **Discord & ox_lib Logging** — Log refund creation and claims to Discord webhooks and/or ox_lib logger
- **Version Checking** — Automatic update notifications via GitHub releases

## Dependencies

- [ox_lib](https://github.com/overextended/ox_lib)
- [ox_inventory](https://github.com/overextended/ox_inventory)
- [oxmysql](https://github.com/overextended/oxmysql)

## Installation

1. Download the latest release
2. Place `pf_refund` in your resources folder
3. Add `ensure pf_refund` to your server.cfg (after dependencies)
4. Configure `script/shared/config/main.lua`
5. Restart your server — database tables are created automatically

## Configuration

```lua
-- script/shared/config/main.lua
{
  framework = "auto",              -- "auto", "qbcore", "qbox", or "esx"
  permissionType = "ace",          -- "ace" or "framework"
  acePermission = "pf_refund.admin",
  allowedGroups = { "admin", "god", "superadmin" },

  commands = {
    refund = "refund",             -- Admin command to open refund UI
    claimRefund = "claimrefund",   -- Player command to claim a refund
  },

  accentColor = "indigo",          -- Mantine color name or hex code
  imageUrl = "nui://ox_inventory/web/images/",

  limits = {
    maxItemCount = 10000,          -- Max count per item in a refund
    maxItemsPerRefund = 5000,      -- Max unique items per refund
    maxUsesCap = 1000,             -- Max uses cap per code
  },

  logging = {
    oxLib = {
      enabled = false,
    },
    discord = {
      enabled = false,
      webhook = "",                -- Discord webhook URL
    },
  },
}
```

## Usage

### Admin — Creating a Refund

1. Run `/refund` in-game to open the admin panel
2. Search and select items, set quantities
3. Optionally add metadata to items (e.g., serial numbers)
4. Configure expiry and max uses
5. Click **Create Refund** and copy the generated code

### Player — Claiming a Refund

1. Run `/claimrefund <code>` in-game
2. Review the items in the claim modal
3. Click **Claim** to receive the items
4. If inventory is full, remaining items are saved for a later claim with the same code

## Permissions

### ACE Permissions

Add to your server.cfg:

```cfg
add_ace group.admin pf_refund.admin allow
```

### Framework Groups

Set `permissionType = "framework"` in config and configure `allowedGroups`.

## Exports

### Server

```lua
-- Give a player their refund items for a code
exports.pf_refund:RefundPlayer(source, code)
-- Returns: boolean

-- Check if a refund code is valid and get its data
exports.pf_refund:CheckCode(code)
-- Returns: RefundRecord | false
```

## Localization

Locale files are in `locales/`. Add a new JSON file (e.g., `locales/fr.json`) following the structure of `locales/en.json`. The server language is controlled by ox_lib's locale convar:

```cfg
setr ox:locale en
```

## Links

- [Patchflow](https://patchflow.md/)
- [Support & Issues](https://patchflow.md/)
- [Docs](https://docs.patchflow.md/PFRefund)

## License

Copyright Patchflow. All rights reserved.
