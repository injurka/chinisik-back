export interface HieroglyphWordProps {
  glyph: string;
  pinyin: {
    pinyin: string;
    tone: {
      index: number;
      type: number;
    }[];
  };
  variant: number;
  translate?: string;
}

export type AllJsonToDomElementProps = HieroglyphWordProps & Record<string, unknown>

export interface JsonToDomElement<T = AllJsonToDomElementProps> {
  tag: string;
  class?: string;
  children?: JsonToDomChildren<T>;
  props?: T;
}

export type JsonToDomChildren<T = AllJsonToDomElementProps> =
  string
  | JsonToDomElement<T>
  | JsonToDomElement<T>[];

