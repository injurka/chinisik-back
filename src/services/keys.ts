import { mockDescriptionHieroglyphKeys } from '../../prisma/data/content'
// deno-lint-ignore-file require-await
import { mockHieroglyphKeys } from '../../prisma/data/keys'

class KeysService {
  //* Create

  //* Read
  getKeys = async () => {
    return mockHieroglyphKeys
  }

  getDescription = async () => {
    return mockDescriptionHieroglyphKeys
  }

  //* Update

  //* Delete
}

export default KeysService
