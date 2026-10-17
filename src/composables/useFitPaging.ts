import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

/**
 * Paging instead of clipping, for list tiles (StatusListTile, ProgressListTile).
 *
 * Rows have a fixed height (labels ellipsized, never wrapped), so the number
 * that fits is just the list area's height divided by it. The list area is
 * whatever the tile has left after header and, when shown, the pager.
 * Measured with a ResizeObserver because that height follows the grid cell,
 * which follows the container width.
 *
 * The row height comes from a CSS custom property on the list element, read on
 * every resize: a tile may switch row layouts via container queries.
 *
 * Showing the pager shrinks the list area, which can only lower perPage
 * further, never bring it back under the row count — so it can't flip
 * back and forth.
 *
 * @param rowHeightVar custom property holding the row height, e.g. '--status-row-height'
 */
export function useFitPaging<T>(items: () => T[], rowHeightVar: string, fallbackRowHeight: number) {
  const listEl: Ref<HTMLElement | null> = ref(null)
  // null until measured: render everything for the first frame.
  const perPage = ref<number | null>(null)
  const page = ref(0)

  const pageCount = computed(() =>
    perPage.value === null ? 1 : Math.max(1, Math.ceil(items().length / perPage.value)),
  )
  const visible = computed(() => {
    if (perPage.value === null) return items()
    const start = page.value * perPage.value
    return items().slice(start, start + perPage.value)
  })

  // Rows can change under a live data source; never leave the page past the end.
  watch(pageCount, (count) => {
    if (page.value > count - 1) page.value = count - 1
  })

  let observer: ResizeObserver | undefined

  onMounted(() => {
    observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const rowHeight = parseFloat(getComputedStyle(entry.target).getPropertyValue(rowHeightVar)) || fallbackRowHeight
      perPage.value = Math.max(1, Math.floor(entry.contentRect.height / rowHeight))
    })
    if (listEl.value) observer.observe(listEl.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { listEl, page, pageCount, visible }
}
