// deno-lint-ignore-file require-await
import { mockHieroglyphKeys } from '../../prisma/data/keys.ts';
import { mockDescriptionHieroglyphKeys } from '../../prisma/data/content.ts';

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
