// src/store/counterStore.ts

// import {create} from "zustand";

// import {persist} from "zustand/middleware";

// interface CounterState {
//     count: number;
//     increment: () => void;
//     decrement: () => void;
// }


/**
 * This is simple state (Can be used in multiple pages if the layer is same and is 'use client')
 */

// export const useCounterStore = create<CounterState>((set) => ({
//     count: 0,
//     increment: () => {
//         set((state) => ({count: state.count + 1}));
//     },
//     decrement: () => {
//         set((state) => ({count: state.count - 1}));
//     }
// }));

/**
 * This one will also save that state to the localstorage using presist
 */

// export const useCounterStore = create<CounterState>()(
//     persist(
//         (set) => (
//             {
//                 count: 0, increment: () => {
//                     set((state) => ({count: state.count + 1}));
//                 }, decrement: () => {
//                     set((state) => ({count: state.count - 1}));
//                 }
//             }
//         ), {name: 'counter-store'}
//     )
// );