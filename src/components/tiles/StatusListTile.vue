<script setup lang="ts">
import Icon from '../icons/Icon.vue'
import TilePager from './TilePager.vue'
import { useFitPaging } from '../../composables/useFitPaging'
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

// One line per row; two (name above state) when the tile is too narrow, see the container query.
const { listEl, page, pageCount, visible } = useFitPaging(() => props.statuses, '--status-row-height', 30)
</script>

<template>
  <div class="status-tile">
    <div class="status-tile__header">
      <Icon class="status-tile__icon" :name="icon" />
      <span class="status-tile__name">{{ name }}</span>
    </div>

    <div ref="listEl" class="status-tile__body">
      <ul class="status-tile__list">
        <li v-for="row in visible" :key="row.label" class="status-tile__row">
          <span class="status-tile__label" :title="row.label">{{ row.label }}</span>
          <span class="status-tile__state">
            <span class="status-tile__swatch" :class="`status-tile__swatch--${row.state}`" aria-hidden="true" />
            {{ STATE_LABEL[row.state] }}
            <span v-if="row.detail" class="status-tile__detail">{{ row.detail }}</span>
          </span>
        </li>
      </ul>
    </div>

    <TilePager v-if="pageCount > 1" v-model="page" :page-count="pageCount" />
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
</style>
