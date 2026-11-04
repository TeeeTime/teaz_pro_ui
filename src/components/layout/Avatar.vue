<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface AvatarProps {
  /** Picture URL, usually from `avatarUrl()`. Without one, or if it fails to load, the initials show. */
  src?: string
  /** The user's name, for the initials. */
  name?: string
  /** Width and height in px. */
  size?: number
  /** Round is reserved for the TopBar, see teaz_pro/docs/STYLE_GUIDE.md. */
  round?: boolean
}

const props = withDefaults(defineProps<AvatarProps>(), {
  name: '',
  size: 36,
})

const initials = computed(() =>
  props.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join(''),
)

// Most users have no picture yet, so a failed load is the normal case, not an error.
const failed = ref(false)
watch(
  () => props.src,
  () => {
    failed.value = false
  },
)
</script>

<template>
  <span
    class="avatar"
    :class="{ 'avatar--round': round }"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.36)}px` }"
    aria-hidden="true"
  >
    <img v-if="src && !failed" class="avatar__image" :src="src" alt="" @error="failed = true" />
    <template v-else>{{ initials }}</template>
  </span>
</template>

<style scoped>
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  font-weight: 600;
  color: var(--color-text-on-accent);
  /* --avatar-background lets a parent change it, e.g. the TopBar on hover. */
  background-color: var(--avatar-background, var(--color-accent));
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);
}

.avatar--round {
  /* Deliberate exception to the no-rounded-corners rule, see STYLE_GUIDE.md. */
  border-radius: 50%;
}

.avatar__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
