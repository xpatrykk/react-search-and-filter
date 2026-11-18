import type { Key, ReactNode } from "react";

export interface ResultsInsertionRenderProps<Item> {
  chunk: Item[];
  insertionIndex: number;
  itemsRendered: number;
  itemsRemaining: number;
}

export interface ResultsInsertion<Item> {
  repeatEveryItems: number;
  render: (props: ResultsInsertionRenderProps<Item>) => ReactNode;
  wrapperClassName?: string | null;
}

export type OnRenderResultItem<Item> = (item: Item, index: number) => ReactNode;
export type GetResultItemKey<Item> = (item: Item, index: number) => Key;
