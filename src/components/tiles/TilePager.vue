<script setup lang="ts">
import Icon from '../icons/Icon.vue'

/** Previous/next and "2 / 3" for list tiles; see useFitPaging. */
defineProps<{ pageCount: number }>()
const page = defineModel<number>({ required: true })
</script>

<template>
  <!-- click/keydown stopped here so paging doesn't bubble into a
       surrounding clickable GridItem and activate it -->
  <div class="tile-pager" @click.stop @keydown.stop>
    <button type="button" class="tile-pager__button" aria-label="Previous page" :disabled="page === 0" @click="page--">
      <Icon name="chevron-left" class="tile-pager__icon" />
    </button>
    <span class="tile-pager__page" aria-live="polite">{{ page + 1 }} / {{ pageCount }}</span>
    <button
      type="button"
      class="tile-pager__button"
      aria-label="Next page"
      :disabled="page >= pageCount - 1"
      @click="page++"
    >
      <Icon name="chevron-right" class="tile-pager__icon" />
    </button>
  </div>
</template>

<style scoped>
.tile-pager {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.tile-pager__page {
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-secondary);
}

.tile-pager__button {
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

.tile-pager__button:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
}

.tile-pager__button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
}

.tile-pager__button:disabled {
  cursor: default;
  opacity: 0.4;
}

.tile-pager__icon {
  width: 16px;
  height: 16px;
}
</style>
