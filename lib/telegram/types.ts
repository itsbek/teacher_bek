/** Minimal Telegram Bot API shapes used by the admin bot (Bot API 10.x). */

export interface TgUser {
  id: number;
  is_bot?: boolean;
}

export interface TgChat {
  id: number;
  type?: string;
}

export interface TgMessage {
  message_id: number;
  chat: TgChat;
  from?: TgUser;
  text?: string;
  reply_to_message?: TgMessage;
}

export interface TgCallbackQuery {
  id: string;
  from: TgUser;
  message?: TgMessage;
  data?: string;
}

export interface TgUpdate {
  update_id?: number;
  message?: TgMessage;
  callback_query?: TgCallbackQuery;
}

export type ButtonStyle = 'primary' | 'success' | 'danger';

export interface InlineButton {
  text: string;
  callback_data?: string;
  url?: string;
  copy_text?: { text: string };
  style?: ButtonStyle;
}

export interface InlineKeyboard {
  inline_keyboard: InlineButton[][];
}

export interface ReplyKeyboard {
  keyboard: { text: string }[][];
  is_persistent: boolean;
  resize_keyboard: boolean;
  input_field_placeholder?: string;
}

export interface ForceReply {
  force_reply: true;
  input_field_placeholder?: string;
}

export type ReplyMarkup = InlineKeyboard | ReplyKeyboard | ForceReply;

/** A rendered screen: HTML text plus an inline keyboard. */
export interface View {
  text: string;
  reply_markup: InlineKeyboard;
}
