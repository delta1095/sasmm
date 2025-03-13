import { atom } from "jotai";

export type Node = {
  id: number;
  x: number;
  y: number;
  z: number;
  support: "fixed" | "free" | "pinned" | "v_roller" | "h_roller";
};

type Element = {
  id: number;
  node1: number;
  node2: number;
};

export const nodesAtom = atom<Node[]>([]);

export const elementsAtom = atom<Element[]>([]);
