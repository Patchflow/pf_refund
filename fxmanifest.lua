game "gta5"
fx_version "cerulean"
lua54 "yes"

author "Patchflow"
description "Refund System"
version "1.0.0"

shared_scripts {
  "@ox_lib/init.lua",
}

client_scripts {
  "script/client/main.lua",
}

server_scripts {
  "@oxmysql/lib/MySQL.lua",
  "script/server/main.lua",
}

files {
  "locales/*.json",
  "types.lua",
  "script/shared/config/*.lua",
  "script/server/modules/*.lua",
  "script/server/frameworks/*.lua",
  "web/dist/**/*",
}

ui_page "web/dist/index.html"
--[[ ui_page "http://localhost:3000/" ]]

ox_libs {
  "locale"
}
