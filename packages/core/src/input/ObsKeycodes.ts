/**
 * Keycodes from: https://github.com/kwhat/libuiohook/blob/1.2/include/uiohook.h
 * [0] -> libuiohook key
 * [1] -> optional alias
 *
 * Comment out keys that you don't want to show
 */
export const ObsKeycodes: Record<string, [key: string, alias: string]> = {
  /* Begin Virtual Key Codes */
  '0x0001': ['VC_ESCAPE', 'ESC'],

  // Begin Function Keys
  0x003b: ['VC_F1', 'F1'],
  0x003c: ['VC_F2', 'F2'],
  0x003d: ['VC_F3', 'F3'],
  0x003e: ['VC_F4', 'F4'],
  0x003f: ['VC_F5', 'F5'],
  0x0040: ['VC_F6', 'F6'],
  0x0041: ['VC_F7', 'F7'],
  0x0042: ['VC_F8', 'F8'],
  0x0043: ['VC_F9', 'F9'],
  0x0044: ['VC_F10', 'F10'],
  0x0057: ['VC_F11', 'F11'],
  0x0058: ['VC_F12', 'F12'],

  0x005b: ['VC_F13', 'F13'],
  0x005c: ['VC_F14', 'F14'],
  0x005d: ['VC_F15', 'F15'],
  0x0063: ['VC_F16', 'F16'],
  0x0064: ['VC_F17', 'F17'],
  0x0065: ['VC_F18', 'F18'],
  0x0066: ['VC_F19', 'F19'],
  0x0067: ['VC_F20', 'F20'],
  0x0068: ['VC_F21', 'F21'],
  0x0069: ['VC_F22', 'F22'],
  0x006a: ['VC_F23', 'F23'],
  0x006b: ['VC_F24', 'F24'],
  // End Function Keys

  // Begin Alphanumeric Zone
  0x0029: ['VC_BACKQUOTE', '`'],

  0x0002: ['VC_1', '1'],
  0x0003: ['VC_2', '2'],
  0x0004: ['VC_3', '3'],
  0x0005: ['VC_4', '4'],
  0x0006: ['VC_5', '5'],
  0x0007: ['VC_6', '6'],
  0x0008: ['VC_7', '7'],
  0x0009: ['VC_8', '8'],
  0x000a: ['VC_9', '9'],
  0x000b: ['VC_0', '0'],

  0x000c: ['VC_MINUS', '-'], // '-'
  0x000d: ['VC_EQUALS', '='], // '='
  0x000e: ['VC_BACKSPACE', 'BACKSPACE'],

  0x000f: ['VC_TAB', 'TAB'],
  0x003a: ['VC_CAPS_LOCK', 'CAPS LOCK'],

  0x001e: ['VC_A', 'A'],
  0x0030: ['VC_B', 'B'],
  0x002e: ['VC_C', 'C'],
  0x0020: ['VC_D', 'D'],
  0x0012: ['VC_E', 'E'],
  0x0021: ['VC_F', 'F'],
  0x0022: ['VC_G', 'G'],
  0x0023: ['VC_H', 'H'],
  0x0017: ['VC_I', 'I'],
  0x0024: ['VC_J', 'J'],
  0x0025: ['VC_K', 'K'],
  0x0026: ['VC_L', 'L'],
  0x0032: ['VC_M', 'M'],
  0x0031: ['VC_N', 'N'],
  0x0018: ['VC_O', 'O'],
  0x0019: ['VC_P', 'P'],
  0x0010: ['VC_Q', 'Q'],
  0x0013: ['VC_R', 'R'],
  0x001f: ['VC_S', 'S'],
  0x0014: ['VC_T', 'T'],
  0x0016: ['VC_U', 'U'],
  0x002f: ['VC_V', 'V'],
  0x0011: ['VC_W', 'W'],
  0x002d: ['VC_X', 'X'],
  0x0015: ['VC_Y', 'Y'],
  0x002c: ['VC_Z', 'Z'],

  0x001a: ['VC_OPEN_BRACKET', '['], // '['
  0x001b: ['VC_CLOSE_BRACKET', ']'], // ']'
  0x002b: ['VC_BACK_SLASH', '\\'], // '\'

  0x0027: ['VC_SEMICOLON', ';'], // ';'
  0x0028: ['VC_QUOTE', "'"],
  0x001c: ['VC_ENTER', 'ENTER'],

  0x0033: ['VC_COMMA', ','], // ', ""],'
  0x0034: ['VC_PERIOD', '.'], // '.'
  0x0035: ['VC_SLASH', '/'], // '/'

  0x0039: ['VC_SPACE', 'SPACE'],
  //  Alphanumeric Zone End

  0x0e37: ['VC_PRINTSCREEN', 'PrtSc'],
  0x0046: ['VC_SCROLL_LOCK', 'SCROLL LOCK'],
  0x0e45: ['VC_PAUSE', 'PAUSE'],

  0x0e46: ['VC_LESSER_GREATER', '|'], // '<', ""], '>', ""], '|' on qwertz layout

  //  Edit Key Zone Begin
  0x0e52: ['VC_INSERT', 'INSERT'],
  0x0e53: ['VC_DELETE', 'DELETE'],
  0x0e47: ['VC_HOME', 'HOME'],
  0x0e4f: ['VC_END', 'END'],
  0x0e49: ['VC_PAGE_UP', 'PAGE UP'],
  0x0e51: ['VC_PAGE_DOWN', 'PAGE DOWN'],

  /* https://github.com/univrsal/input-overlay/issues/174 */
  0xee52: ['VC_INSERT', 'INSERT'], // 0x0e52
  0xee53: ['VC_DELETE', 'DELETE'], // 0x0e53
  0xee47: ['VC_HOME', 'HOME'], // 0x0e47
  0xee4f: ['VC_END', 'END'], // 0x0e4f
  0xee49: ['VC_PAGE_UP', 'PAGE UP'], // 0x0e49
  0xee51: ['VC_PAGE_DOWN', 'PAGE DOWN'], // 0x0e51
  //  Edit Key Zone End

  //  Cursor Key Zone Begin
  0x0e48: ['VC_UP', 'ARROW UP'],
  0x0e4b: ['VC_LEFT', 'ARROW LEFT'],
  // 0x0e4c: ["VC_CLEAR", ""],
  0x0e4d: ['VC_RIGHT', 'ARROW RIGHT'],
  0x0e50: ['VC_DOWN', 'ARROW DOWN'],
  /* libuihook values */
  0xe048: ['VC_UP', 'ARROW UP'],
  0xe04b: ['VC_LEFT', 'ARROW LEFT'],
  // 0xe04c: ["VC_CLEAR", ""],
  0xe04d: ['VC_RIGHT', 'ARROW RIGHT'],
  0xe050: ['VC_DOWN', 'ARROW DOWN'],
  /* https://github.com/univrsal/input-overlay/issues/174 */
  0xee48: ['VC_UP', 'ARROW UP'], // 0x0e48
  0xee4b: ['VC_LEFT', 'ARROW LEFT'], // 0x0e4b
  // 0xee4c: ["VC_CLEAR", ""], // 0x0e4c
  0xee4d: ['VC_RIGHT', 'ARROW RIGHT'], // 0x0e4d
  0xee50: ['VC_DOWN', 'ARROW DOWN'], // 0x0e50
  //  Cursor Key Zone End

  //  Numeric Zone Begin
  0x0045: ['VC_NUM_LOCK', 'NUM LOCK'],
  0x0e35: ['VC_KP_DIVIDE', 'NUM /'],
  0x0037: ['VC_KP_MULTIPLY', 'NUM *'],
  0x004a: ['VC_KP_SUBTRACT', 'NUM -'],
  0x0e0d: ['VC_KP_EQUALS', 'NUM ='],
  0x004e: ['VC_KP_ADD', 'NUM +'],
  0x0e1c: ['VC_KP_ENTER', 'NUM ENTER'],
  0x0053: ['VC_KP_SEPARATOR', 'NUM .'],

  0x004f: ['VC_KP_1', 'NUM 1'],
  0x0050: ['VC_KP_2', 'NUM 2'],
  0x0051: ['VC_KP_3', 'NUM 3'],
  0x004b: ['VC_KP_4', 'NUM 4'],
  0x004c: ['VC_KP_5', 'NUM 5'],
  0x004d: ['VC_KP_6', 'NUM 6'],
  0x0047: ['VC_KP_7', 'NUM 7'],
  0x0048: ['VC_KP_8', 'NUM 8'],
  0x0049: ['VC_KP_9', 'NUM 9'],
  0x0052: ['VC_KP_0', 'NUM 0'],

  0xee00: ['VC_KP_DELETE', ''], // VC_KP_SEPARATOR, ""],
  //  Numeric Zone End

  //  Modifier and Control Keys Begin
  0x002a: ['VC_SHIFT_L', 'L SHIFT'],
  0x0036: ['VC_SHIFT_R', 'R SHIFT'],
  0x001d: ['VC_CONTROL_L', 'L CTRL'],
  0x0e1d: ['VC_CONTROL_R', 'R CTRL'],
  0x0038: ['VC_ALT_L', 'L ALT'], // Option or Alt Key
  0x0e38: ['VC_ALT_R', 'R ALT'], // Option or Alt Key
  0x0e5b: ['VC_META_L', 'WIN'], // Windows or Command Key
  0x0e5c: ['VC_META_R', 'WIN'], // Windows or Command Key
  0x0e5d: ['VC_CONTEXT_MENU', 'CONTEXT MENU'],
  //  Modifier and Control Keys End
};
