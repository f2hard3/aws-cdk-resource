import { SpaceEntry } from '../model/model'

export class MissingFieldError extends Error {
  constructor(missingField: string ) {
    super(`Value for ${missingField} expected`)
  }
}

export class JSONError extends Error {}

export function validateAsSpaceEntry(arg: unknown) {
  isSpaceEntry(arg)
}

function isSpaceEntry(value: unknown): value is SpaceEntry {
  if (value && typeof value === 'object') {
    if (!('id' in value)) {
      throw new MissingFieldError('id')
    }
    if (!('location' in value)) {
      throw new MissingFieldError('location')
    }
    if (!('name' in value)) {
      throw new MissingFieldError('name')
    }
  } else {
    throw new Error('Please provide appropriate values')
  }
  
  return true
}