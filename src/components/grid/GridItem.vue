<script setup lang="ts">
import { computed } from 'vue'

export interface GridItemProps {
  /** Columns this cell spans. */
  colSpan?: number
  /** Rows this cell spans. */
  rowSpan?: number
  /** Renders as a focusable, clickable surface (button semantics). */
  clickable?: boolean
  /** Disables interaction and dims the cell. */
  disabled?: boolean
  ariaLabel?: string
  /**
   * Columns this cell spans in GridLayout's phone grid (with `phone` on, on
   * containers up to 640px). Unset: the full width.
   */
  phoneColSpan?: number
  /**
   * Rows this cell spans in the phone grid, or 'auto' (the default): one
   * row that grows to fit the content.
   */
  phoneRowSpan?: number | 'auto'
  /** Position in the phone grid (CSS `order`), so phones can list cells in another order. */
  phoneOrder?: number
}

const props = withDefaults(defineProps<GridItemProps>(), {
  colSpan: 1,
  rowSpan: 1,
  clickable: false,
  disabled: false,
  phoneRowSpan: 'auto',
})

const emit = defineEmits<{
  click: [MouseEvent | KeyboardEvent]
}>()

/*
 * Placement through custom properties rather than grid-column/grid-row
 * inline: inline styles would beat GridLayout's phone grid rule, which
 * switches to the --grid-item-phone-* values on narrow containers.
 */
const phoneAuto = computed(() => props.phoneRowSpan === 'auto')
const style = computed(() => ({
  '--grid-item-col': `span ${props.colSpan}`,
  '--grid-item-row': `span ${props.rowSpan}`,
  '--grid-item-phone-col': props.phoneColSpan ? `span ${props.phoneColSpan}` : '1 / -1',
  '--grid-item-phone-row': phoneAuto.value ? 'auto' : `span ${props.phoneRowSpan}`,
  '--grid-item-phone-order': props.phoneOrder ?? 0,
}))
/*
 * No aspect-ratio here. It used to be set to `colSpan / rowSpan` as a
 * fallback for the one frame before GridLayout's old JS measurement ran —
 * that gap no longer exists (GridLayout now sizes everything synchronously
 * via CSS, nothing async to bridge). Worse, it turned out not to be inert
 * once the grid area is definite-sized in both axes as I'd assumed:
 * aspect-ratio still measurably skews a stretched grid item's size
 * whenever colSpan !== rowSpan (verified — a 2x1 item rendered 16px too
 * narrow, a 1x2 item 8px too wide, while every colSpan===rowSpan item,
 * where the ratio is 1:1 and so happens to match what stretch alone would
 * produce anyway, looked fine and masked the bug). Plain `span N` on both
 * axes into GridLayout's fixed-size tracks is sufficient and exact on its
 * own — default stretch alignment just fills the grid area.
 */

function handleClick(event: MouseEvent | KeyboardEvent) {
  if (props.disabled) return
  emit('click', event)
}
</script>

<template>
  <div
    class="grid-item"
    :class="{ 'grid-item--clickable': clickable, 'grid-item--disabled': disabled, 'grid-item--phone-auto': phoneAuto }"
    :style="style"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable && !disabled ? 0 : undefined"
    :aria-disabled="disabled || undefined"
    :aria-label="ariaLabel"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <slot />
  </div>
</template>

<style scoped>
.grid-item {
  grid-column: var(--grid-item-col);
  grid-row: var(--grid-item-row);
  display: flex;
  min-width: 0;
  min-height: 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 1px 2px var(--color-shadow);
  color: var(--color-text-primary);
  overflow: hidden;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    opacity var(--transition-fast);
}

.grid-item--clickable {
  cursor: pointer;
}

.grid-item--clickable:hover {
  background-color: var(--color-surface-hover);
  box-shadow: 0 4px 12px var(--color-shadow-strong);
}

.grid-item--clickable:active {
  background-color: var(--color-surface-active);
}

.grid-item--clickable:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.grid-item--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
