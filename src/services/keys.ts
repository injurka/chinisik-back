// deno-lint-ignore-file require-await
import { mockDescriptionHieroglyphKeys, mockHieroglyphKeys } from '../../prisma/data/keys.ts';

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
