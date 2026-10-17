<script setup lang="ts">
import Icon from '../icons/Icon.vue'

/*
 * Stand-in for an app's tile when the user lacks the app's role. Purely
 * informational: put it in a non-clickable GridItem (clickable false), which
 * also means no hover effect.
 */
export interface NoAccessTileProps {
  icon: string
  name: string
  message?: string
}

withDefaults(defineProps<NoAccessTileProps>(), {
  message: "You don't have access to this app.",
})
</script>

<template>
  <div class="no-access-tile">
    <Icon class="no-access-tile__icon" :name="icon" />
    <span class="no-access-tile__name">{{ name }}</span>
    <span class="no-access-tile__message">{{ message }}</span>
  </div>
</template>

<style scoped>
.no-access-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 100%;
  padding: 16px;
  text-align: center;
}

.no-access-tile__icon {
  width: 28px;
  height: 28px;
  color: var(--color-text-secondary);
}

.no-access-tile__name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.no-access-tile__message {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}
</style>
