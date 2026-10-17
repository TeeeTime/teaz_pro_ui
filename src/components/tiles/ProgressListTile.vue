<script setup lang="ts">
import Icon from '../icons/Icon.vue'
import TilePager from './TilePager.vue'
import { useFitPaging } from '../../composables/useFitPaging'
import type { ProgressRow } from '../../types'

export interface ProgressListTileProps {
  icon: string
  name: string
  items: ProgressRow[]
  /** Shown instead of the list when there are no items. */
  emptyText?: string
}

const props = withDefaults(defineProps<ProgressListTileProps>(), {
  emptyText: 'Nothing here yet.',
})

const { listEl, page, pageCount, visible } = useFitPaging(() => props.items, '--progress-row-height', 46)

function clamp(percent: number): number {
  return Math.min(100, Math.max(0, Math.round(percent)))
}
</script>

<template>
  <div class="progress-tile">
    <div class="progress-tile__header">
      <Icon class="progress-tile__icon" :name="icon" />
      <span class="progress-tile__name">{{ name }}</span>
    </div>

    <div ref="listEl" class="progress-tile__body">
      <p v-if="!items.length" class="progress-tile__empty">{{ emptyText }}</p>
      <ul v-else class="progress-tile__list">
        <li v-for="item in visible" :key="item.label" class="progress-tile__row">
          <span class="progress-tile__line">
            <span class="progress-tile__label" :title="item.label">{{ item.label }}</span>
            <span class="progress-tile__percent">{{ clamp(item.percent) }}%</span>
          </span>
          <span
            class="progress-tile__track"
            role="progressbar"
            :aria-valuenow="clamp(item.percent)"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="item.label"
          >
            <span class="progress-tile__fill" :style="{ width: `${clamp(item.percent)}%` }" />
          </span>
        </li>
      </ul>
    </div>

    <TilePager v-if="pageCount > 1" v-model="page" :page-count="pageCount" />
  </div>
</template>

<style scoped>
.progress-tile {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  padding: 16px;
}

.progress-tile__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-tile__icon {
  width: 28px;
  height: 28px;
  color: var(--color-text-secondary);
}

.progress-tile__name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* Takes whatever height is left; measured for paging. */
.progress-tile__body {
  --progress-row-height: 46px;
  flex: 1;
  min-height: 0;
  margin-top: 12px;
  overflow: hidden;
}

.progress-tile__empty {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.progress-tile__list {
  list-style: none;
  padding: 0;
}

.progress-tile__row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  height: var(--progress-row-height);
}

.progress-tile__row + .progress-tile__row {
  border-top: 1px solid var(--color-border);
}

.progress-tile__line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.78rem;
}

.progress-tile__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-primary);
}

.progress-tile__percent {
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-secondary);
}

.progress-tile__track {
  display: block;
  height: 4px;
  background-color: var(--color-surface-active);
}

.progress-tile__fill {
  display: block;
  height: 100%;
  background-color: var(--color-accent);
}
</style>
