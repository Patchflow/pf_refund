---@meta

---@alias FrameworkType 'auto' | 'qbcore' | 'qbox' | 'esx'
---@alias PermissionType 'framework' | 'ace'
---@alias LogEvent 'CreateRefund' | 'ClaimRefund' | 'PartialClaim'

---@class OxLibLoggingConfig
---@field enabled boolean

---@class DiscordLoggingConfig
---@field enabled boolean
---@field webhook string

---@class LoggingConfig
---@field oxLib OxLibLoggingConfig
---@field discord DiscordLoggingConfig

---@class CommandsConfig
---@field refund string
---@field claimRefund string

---@class LimitsConfig
---@field maxItemCount number
---@field maxItemsPerRefund number
---@field maxUsesCap number

---@class Config
---@field framework FrameworkType
---@field permissionType PermissionType
---@field acePermission string
---@field allowedGroups string[]
---@field commands CommandsConfig
---@field accentColor string
---@field imageUrl string
---@field limits LimitsConfig
---@field logging LoggingConfig

---@class RefundItem
---@field name string
---@field label string
---@field count number
---@field metadata? table<string, string>

---@class PlayerIdentifiers
---@field license? string
---@field discord? string
---@field steam? string

---@class LogData
---@field source number
---@field steamName string
---@field license? string
---@field discord? string
---@field steam? string
---@field code? string
---@field items? RefundItem[]
---@field maxUses? number
---@field expiresAt? string
---@field delivered? RefundItem[]
---@field remaining? RefundItem[]

---@class RefundRecord
---@field id number
---@field code string
---@field items string
---@field max_uses number
---@field times_used number
---@field expires_at? string
---@field created_by string
---@field created_at string
---@field is_expired? number

---@class ClaimRecord
---@field id number
---@field refund_code string
---@field player_identifier string
---@field remaining_items? string
---@field claimed_at string

---@class ValidateResult
---@field refund RefundRecord
---@field items RefundItem[]
---@field isResume boolean

---@class ClaimResult
---@field success boolean
---@field partial boolean

---@class CreateRefundData
---@field items RefundItem[]
---@field maxUses? number
---@field expiresIn? string

---@class ConfirmClaimData
---@field code string

---@class Bridge
---@field hasPermission fun(source: number): boolean
---@field getIdentifier fun(source: number): string?
---@field getIdentifiers fun(source: number): PlayerIdentifiers

---@class Logger
---@field log fun(event: LogEvent, data: LogData)
