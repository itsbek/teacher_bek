# Telegram Bot API notes for @classleadsbot

Researched 2026-10-21 from the official pages. Quotes are from the docs; anything not found on the pages read is marked "not verified".

## 1. Current version
- Latest entry in "Recent changes" is **Bot API 10.3, August 24, 2026**. Previous: 10.2 (July 14, 2026). https://core.telegram.org/bots/api#recent-changes
- 10.3 relevant changes: `force_reply` added to `InlineKeyboardMarkup` and `ReplyKeyboardMarkup`; `disabled` (DisabledButton) added to `InlineKeyboardButton`; `EphemeralMessageParameters` added. https://core.telegram.org/bots/api#recent-changes

## 2. Commands and menus
- `setMyCommands`: up to 100 `BotCommand`s; optional `scope` (default `BotCommandScopeDefault`) and `language_code` (two-letter ISO 639-1; empty applies to all users in the scope without dedicated commands). https://core.telegram.org/bots/api#setmycommands
- `BotCommand.command`: 1-32 characters, only lowercase English letters, digits and underscores. `description`: 1-256 characters. https://core.telegram.org/bots/api#botcommand
- Scopes: seven `BotCommandScope` types (Default, AllPrivateChats, AllGroupChats, AllChatAdministrators, Chat, ChatAdministrators, ChatMember). For a private chat with the owner, the most specific list wins: `BotCommandScopeChat` + language_code, then `BotCommandScopeChat`, then `AllPrivateChats` + language_code, then `AllPrivateChats`, then Default. https://core.telegram.org/bots/api#determining-list-of-commands
- Menu display: apps "suggest a list of supported commands with descriptions when the user enters a `/`"; selecting one sends it immediately. https://core.telegram.org/bots/features#commands
- `/start`, `/help`, `/settings` are expected for consistency. https://core.telegram.org/bots/features#global-commands
- `setChatMenuButton`: `chat_id` (omit to change the default) and `menu_button`. `MenuButtonCommands` opens the command list (the default); `MenuButtonWebApp` launches a Web App; `MenuButtonDefault` is the default. A per-chat button overrides the default. https://core.telegram.org/bots/api#setchatmenubutton and https://core.telegram.org/bots/api#menubuttoncommands

## 3. Profile text (before /start, and in the profile)
- `setMyDescription`: 0-512 characters; "shown in the chat with the bot if the chat is empty". https://core.telegram.org/bots/api#setmydescription
- `setMyShortDescription`: 0-120 characters; "shown on the bot's profile page and is sent together with the link when users share the bot". https://core.telegram.org/bots/api#setmyshortdescription
- `setMyName`: 0-64 characters. https://core.telegram.org/bots/api#setmyname
- All three accept `language_code`. Empty string removes the language-specific value.

## 4. Message formatting
- `parse_mode: "HTML"` supports `<b>`/`<strong>`, `<i>`/`<em>`, `<u>`/`<ins>`, `<s>`/`<strike>`/`<del>`, `<span class="tg-spoiler">`/`<tg-spoiler>`, `<a href>`, `<tg-emoji>`, `<tg-time>`, `<code>`, `<pre>` (nested `<code class="language-…">` for highlighting), and `<blockquote>` (with `expandable` attribute). "Only the tags mentioned above are currently supported." https://core.telegram.org/bots/api#html-style
- Escape every `<`, `>`, `&` that is not part of a tag or entity as `&lt;`, `&gt;`, `&amp;`. Only those three named entities (plus `&quot;`) are supported; numeric entities are fine. https://core.telegram.org/bots/api#html-style
- Entities can nest, with restrictions: blockquotes cannot nest; `pre`/`code` cannot contain other entities. https://core.telegram.org/bots/api#formatting-options
- Length: message text is "1-4096 characters after entities parsing". https://core.telegram.org/bots/api#sendmessage
- `link_preview_options` (`is_disabled: true` turns previews off) is a parameter of `sendMessage`/`editMessageText`. https://core.telegram.org/bots/api#linkpreviewoptions
- `tel:` links: the HTML example list in the regular formatting section does not include `tel:`. `<a href="tel:…">` appears only in the Rich Markdown/HTML sections and the MarkdownV2 example. Phone-number auto-linking is not documented for bots. Not verified for regular HTML messages. Test on a real device before relying on it; if it does not render as a link, send the number as plain text.
- `tg://user?id=…` mentions work only inside an inline link or inline keyboard button, not in plain message text, and only if the user has contacted the bot. https://core.telegram.org/bots/api#formatting-options
- Telegram shows an "Open this link?" alert before opening an inline link. https://core.telegram.org/bots/api#formatting-options

## 5. Inline keyboards
- `InlineKeyboardButton`: `text` plus exactly one action field. `callback_data` is "1-64 bytes". `url` (HTTP or tg://), `copy_text` (`CopyTextButton`, text "1-256 characters"), `switch_inline_query*`, `web_app`, `login_url`, `callback_game`. Also `style` ("danger", "success", "primary"; app default if omitted), `icon_custom_emoji_id`, `disabled` (DisabledButton). https://core.telegram.org/bots/api#inlinekeyboardbutton and https://core.telegram.org/bots/api#copytextbutton
- Callback buttons: "After the user presses a callback button, Telegram clients will display a progress bar until you call answerCallbackQuery." Call it even with no options. https://core.telegram.org/bots/api#inlinekeyboardbutton
- `answerCallbackQuery`: `text` (0-200 chars), `show_alert` (alert instead of toast), `url`, `cache_time` (seconds the result may be cached client-side; default 0). https://core.telegram.org/bots/api#answercallbackquery
- Editing in place: `editMessageText` (1-4096 chars) and `editMessageReplyMarkup` return the edited Message when not inline. The "48 hours" limit in these methods applies to business messages without an inline keyboard. https://core.telegram.org/bots/api#editmessagetext and https://core.telegram.org/bots/api#editmessagereplymarkup
- Layout: rows are arrays of buttons; the docs do not set a per-row maximum in the parts read. Not verified.

## 6. Reply keyboards vs inline keyboards
- `ReplyKeyboardMarkup`: `is_persistent` ("always show the keyboard when the regular keyboard is hidden", default false), `resize_keyboard`, `one_time_keyboard`, `input_field_placeholder` (1-64 chars). https://core.telegram.org/bots/api#replykeyboardmarkup
- Inline keyboards suit per-lead actions (status change, pagination). A persistent reply keyboard suits a single-admin bot's main menu (Leads / Stats / New).
- `ForceReply` (`force_reply: true`, `input_field_placeholder`, `selective`) shows a reply interface, "without having to sacrifice privacy mode". https://core.telegram.org/bots/api#forcereply

## 7. Webhooks
- `setWebhook`: `secret_token` (1-256 chars, `A-Z a-z 0-9 _ -`) is sent back in the `X-Telegram-Bot-Api-Secret-Token` header. Check it on every request. https://core.telegram.org/bots/api#setwebhook
- `allowed_updates` (empty list = all except chat_member, message_reaction, message_reaction_count). `max_connections` 1-100, default 40. `drop_pending_updates`. https://core.telegram.org/bots/api#setwebhook
- Webhook ports: 443, 80, 88, 8443; a valid SSL certificate is required. https://core.telegram.org/bots/faq#im-having-problems-with-webhooks
- Non-2XX responses cause retries "a reasonable amount of attempts", so answer quickly and do slow work after responding. https://core.telegram.org/bots/api#setwebhook
- You can reply inside the webhook body with a method name, but "It's not possible to know that such a request was successful or get its result." https://core.telegram.org/bots/api#making-requests-when-getting-updates

## 8. Limits
- Per chat: "avoid sending more than one message per second"; 429 errors otherwise. https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this
- Per group: at most 20 messages per minute. Same FAQ anchor.
- Broadcast: about 30 messages per second without paid broadcasts. Same FAQ anchor.
- `deleteMessage`: only messages sent less than 48 hours ago. https://core.telegram.org/bots/api#deletemessage
- Callback query timing beyond the progress-bar note: not verified in the pages read.

## 9. Features worth using (https://core.telegram.org/bots/features)
- **Deep linking** (`t.me/<bot>?start=…`): a "Lead" button on the owner's notification can open the bot straight on that lead. https://core.telegram.org/bots/features#deep-linking
- **ForceReply**: a clean step to type a note or a new phone number without a menu. https://core.telegram.org/bots/api#forcereply
- **Chat actions** (`sendChatAction`, status lasts 5 seconds or less): show "typing" while a stats query runs. https://core.telegram.org/bots/api#sendchataction
- **Message reactions** (`setMessageReaction`): mark a handled lead with a reaction instead of a new reply. https://core.telegram.org/bots/api#setmessagereaction
- **Pinned messages** (`pinChatMessage`): pin the daily "new leads" summary. Needs admin rights in groups; private chats allow it. https://core.telegram.org/bots/api#pinchatmessage
- **Inline keyboards with `copy_text`**: one tap copies a student's phone number. https://core.telegram.org/bots/api#copytextbutton
- Privacy mode is on by default for bots in groups; not relevant to a private admin chat. https://core.telegram.org/bots/features#privacy-mode

## 10. Recommended UX pattern for a single-admin bot
1. Set `/start`, `/help`, `/settings` as global commands; keep the rest in a per-chat `BotCommandScopeChat` list for the owner.
2. Use `is_persistent` reply keyboard for main navigation; inline keyboards for per-lead actions.
3. Put status changes in inline keyboards and update the message with `editMessageText` / `editMessageReplyMarkup` instead of sending new messages.
4. Always answer callback queries; use `show_alert` only for errors.
5. Use `ForceReply` for free text (notes, corrections).
6. Escape user-supplied names and messages before sending with `parse_mode: "HTML"`.
7. Verify `X-Telegram-Bot-Api-Secret-Token` on every webhook request; respond 200 first, then process.
8. Stay under 1 message per second per chat when sending batch digests.
9. Use `link_preview_options.is_disabled` for messages containing URLs.
