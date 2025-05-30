import type { Initial } from '~/models/pinyin/pinyin'

export function mockInitials() {
  return [
    { id: 1, name: 'b', pos: 1 },
    { id: 2, name: 'p', pos: 2 },
    { id: 3, name: 'm', pos: 3 },
    { id: 4, name: 'f', pos: 4 },
    { id: 5, name: 'd', pos: 5 },
    { id: 6, name: 't', pos: 6 },
    { id: 7, name: 'n', pos: 7 },
    { id: 8, name: 'l', pos: 8 },
    { id: 9, name: 'g', pos: 9 },
    { id: 10, name: 'k', pos: 10 },
    { id: 11, name: 'h', pos: 11 },
    { id: 12, name: 'z', pos: 12 },
    { id: 13, name: 'c', pos: 13 },
    { id: 14, name: 's', pos: 14 },
    { id: 15, name: 'zh', pos: 15 },
    { id: 16, name: 'ch', pos: 16 },
    { id: 17, name: 'sh', pos: 17 },
    { id: 18, name: 'r', pos: 18 },
    { id: 19, name: 'j', pos: 19 },
    { id: 20, name: 'q', pos: 20 },
    { id: 21, name: 'x', pos: 21 },
  ] satisfies Initial[]
}
