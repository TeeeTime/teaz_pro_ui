<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Icon from '../icons/Icon.vue'
import type { StatusRow } from '../../types'

export interface StatusListTileProps {
  icon: string
  name: string
  statuses: StatusRow[]
}

const props = defineProps<StatusListTileProps>()

// Short, visible state words — not color alone. The warning swatch in
// particular is low-contrast on a light surface as a lone mark (see
// themes.css), so the text label is the real carrier, the swatch a
// secondary cue for at-a-glance scanning.
const STATE_LABEL: Record<StatusRow['state'], string> = {
  good: 'Operational',
  warning: 'Degraded',
  critical: 'Down',
}

/*
 * Paging instead of clipping: rows have a fixed height (labels ellipsized,
 * never wrapped), so the number that fits is just the list area's height
 * divided by it. The list area is whatever the tile has left after header
 * and, when shown, the pager. Measured with a ResizeObserver because that
 * height follows the grid cell, which follows the container width.
 *
 * The row height itself comes from CSS (--status-row-height): one line
 * normally, two (name above state) when the tile is too narrow for both
 * side by side. Read on every resize, since that switch is a container
 * query on the tile's width.
 *
 * Showing the pager shrinks the list area, which can only lower perPage
 * further, never bring it back under the row count — so it can't flip
 * back and forth.
 */

const listEl = ref<HTMLElement | null>(null)
// null until measured: render everything for the first frame.
const perPage = ref<number | null>(null)
const page = ref(0)

const pageCount = computed(() =>
  perPage.value === null ? 1 : Math.max(1, Math.ceil(props.statuses.length / perPage.value)),
)
const visibleRows = computed(() => {
  if (perPage.value === null) return props.statuses
  const start = page.value * perPage.value
  return props.statuses.slice(start, start + perPage.value)
})

// Rows can change under a live data source; never leave the page past the end.
watch(pageCount, (count) => {
  if (page.value > count - 1) page.value = count - 1
})

let observer: ResizeObserver | undefined

onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    if (!entry) return
    const rowHeight = parseFloat(getComputedStyle(entry.target).getPropertyValue('--status-row-height')) || 30
    perPage.value = Math.max(1, Math.floor(entry.contentRect.height / rowHeight))
  })
  if (listEl.value) observer.observe(listEl.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="status-tile">
    <div class="status-tile__header">
      <Icon class="status-tile__icon" :name="icon" />
      <span class="status-tile__name">{{ name }}</span>
    </div>

    <div ref="listEl" class="status-tile__body">
      <ul class="status-tile__list">
        <li v-for="row in visibleRows" :key="row.label" class="status-tile__row">
          <span class="status-tile__label" :title="row.label">{{ row.label }}</span>
          <span class="status-tile__state">
            <span class="status-tile__swatch" :class="`status-tile__swatch--${row.state}`" aria-hidden="true" />
            {{ STATE_LABEL[row.state] }}
            <span v-if="row.detail" class="status-tile__detail">{{ row.detail }}</span>
          </span>
        </li>
      </ul>
    </div>

    <!-- click/keydown stopped here so paging doesn't bubble into a
         surrounding clickable GridItem and activate it -->
    <div v-if="pageCount > 1" class="status-tile__pager" @click.stop @keydown.stop>
      <button
        type="button"
        class="status-tile__page-button"
        aria-label="Previous page"
        :disabled="page === 0"
        @click="page--"
      >
        <Icon name="chevron-left" class="status-tile__page-icon" />
      </button>
      <span class="status-tile__page" aria-live="polite">{{ page + 1 }} / {{ pageCount }}</span>
      <button
        type="button"
        class="status-tile__page-button"
        aria-label="Next page"
        :disabled="page >= pageCount - 1"
        @click="page++"
      >
        <Icon name="chevron-right" class="status-tile__page-icon" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.status-tile {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  padding: 16px;
}

.status-tile__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-tile__icon {
  width: 28px;
  height: 28px;
  color: var(--color-text-secondary);
}

.status-tile__name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Takes whatever height is left; measured for paging. */
.status-tile__body {
  --status-row-height: 30px;
  flex: 1;
  min-height: 0;
  margin-top: 12px;
  overflow: hidden;
}

.status-tile__list {
  list-style: none;
  padding: 0;
}

.status-tile__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: var(--status-row-height);
  font-size: 0.78rem;
}

.status-tile__row + .status-tile__row {
  border-top: 1px solid var(--color-border);
}

.status-tile__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-primary);
}

.status-tile__state {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  color: var(--color-text-secondary);
}

/* Too narrow for name and state side by side (phone, 2-column grid):
   state goes under the name, so neither gets squeezed to nothing. */
@container (max-width: 160px) {
  .status-tile__body {
    --status-row-height: 46px;
  }

  .status-tile__row {
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 2px;
  }

  .status-tile__label {
    flex: none;
  }
}

.status-tile__detail {
  font-variant-numeric: tabular-nums;
}

.status-tile__swatch {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
}

.status-tile__swatch--good {
  background-color: var(--color-status-good);
}

.status-tile__swatch--warning {
  background-color: var(--color-status-warning);
}

.status-tile__swatch--critical {
  background-color: var(--color-status-critical);
}

.status-tile__pager {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.status-tile__page {
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-secondary);
}

.status-tile__page-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  color: var(--color-text-primary);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.status-tile__page-button:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
}

.status-tile__page-button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}

.status-tile__page-button:disabled {
  cursor: default;
  opacity: 0.4;
}

.status-tile__page-icon {
  width: 16px;
  height: 16px;
}
</style>
