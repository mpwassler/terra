import { writable, derived } from 'svelte/store'

export const slideIndex = writable(0)
export const anottations = writable([])
export const selectedAnottation = derived(
  [slideIndex, anottations],
  ([$slideIndex, $anottations]) => $anottations[$slideIndex]
)
