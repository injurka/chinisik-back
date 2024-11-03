import type { SplitGlyphsPayload } from '~/models/llvm'

import { getPromt } from '~/utils/promt'

class LlvmService {
  splitGlyphs = async (params: SplitGlyphsPayload) => {
    const promt = getPromt(params)

    // TODO ai generate with promt

    return promt
  }
}

export { LlvmService }
