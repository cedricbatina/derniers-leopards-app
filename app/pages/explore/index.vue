<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useI18n, useLocalePath, useSeoMeta } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: () => t('seo.explore.index.title'),
  description: () => t('seo.explore.index.description'),
  ogTitle: () => t('seo.explore.index.title'),
  ogDescription: () => t('seo.explore.index.description'),
  ogType: 'website',
})

/**
 * Reveal on scroll (opt-in via .js-reveal)
 */
let io
onMounted(() => {
  if (!import.meta.client) return

  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  const els = Array.from(document.querySelectorAll('.js-reveal'))

  if (reduce) {
    els.forEach((el) => el.classList.add('is-revealed'))
    return
  }

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )

  els.forEach((el, idx) => {
    el.style.setProperty('--reveal-delay', `${Math.min(idx * 55, 320)}ms`)
    io.observe(el)
  })
})

onBeforeUnmount(() => {
  if (io) io.disconnect()
})
</script>

<template>
  <section class="space-y-6 sm:space-y-10">
    <!-- HERO -->
    <div class="card card-hover card-accent accent-leopard overflow-hidden js-reveal">
      <div class="card-body">
        <div class="flex flex-col gap-4 sm:gap-5">
          <p class="badge badge-accent w-fit">
            <Icon name="mdi:compass-outline" aria-hidden="true" />
            {{ t('explore.index.hero.badge') }}
          </p>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight title-gradient title-underline">
            {{ t('explore.index.hero.title') }}
          </h1>

          <p class="text-subtle max-w-2xl">
            {{ t('explore.index.hero.lead') }}
          </p>

          <div class="flex flex-wrap gap-2 pt-1">
            <NuxtLink :to="localePath('/register')" class="btn btn-primary focus-ring">
              <Icon name="mdi:account-plus" aria-hidden="true" />
              {{ t('explore.common.start') }}
            </NuxtLink>

            <NuxtLink :to="localePath('/')" class="btn btn-ghost focus-ring">
              <Icon name="mdi:home-outline" aria-hidden="true" />
              {{ t('explore.common.backHome') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- POUR QUI -->
    <div class="card js-reveal">
      <div class="card-body">
        <div class="flex items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="font-extrabold title-gradient">{{ t('explore.index.forWho.title') }}</div>
            <div class="text-sm text-muted">{{ t('explore.index.forWho.subtitle') }}</div>
          </div>
          <div class="badge">
            <Icon name="mdi:account-group-outline" aria-hidden="true" />
            {{ t('explore.index.forWho.badge') }}
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
          <NuxtLink :to="localePath('/explore/writing')" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-earth">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:pencil-outline" aria-hidden="true" />
                    {{ t('explore.index.cards.writing.title') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="text-sm text-muted">{{ t('explore.index.cards.writing.desc') }}</div>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/editors')" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-forest">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:clipboard-check-outline" aria-hidden="true" />
                    {{ t('explore.index.cards.editors.title') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="text-sm text-muted">{{ t('explore.index.cards.editors.desc') }}</div>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/studios')" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-river">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:movie-open" aria-hidden="true" />
                    {{ t('explore.index.cards.studios.title') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="text-sm text-muted">{{ t('explore.index.cards.studios.desc') }}</div>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/creators')" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-copper">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:palette-outline" aria-hidden="true" />
                    {{ t('explore.index.cards.creators.title') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="text-sm text-muted">{{ t('explore.index.cards.creators.desc') }}</div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- FONCTIONS -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink :to="localePath('/explore/structuring')" class="card-link js-reveal">
        <div class="card card-hover card-accent accent-earth">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:layers-triple" aria-hidden="true" />
                {{ t('explore.index.features.structuring.badge') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="font-extrabold title-gradient">{{ t('explore.index.features.structuring.title') }}</div>
            <p class="text-sm text-muted">{{ t('explore.index.features.structuring.desc') }}</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink :to="localePath('/explore/timeline')" class="card-link js-reveal">
        <div class="card card-hover card-accent accent-river">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:timeline" aria-hidden="true" />
                {{ t('explore.index.features.timeline.badge') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="font-extrabold title-gradient">{{ t('explore.index.features.timeline.title') }}</div>
            <p class="text-sm text-muted">{{ t('explore.index.features.timeline.desc') }}</p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink :to="localePath('/explore/access')" class="card-link js-reveal">
        <div class="card card-hover card-accent accent-copper">
          <div class="card-body space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="badge badge-accent w-fit">
                <Icon name="mdi:shield-lock-outline" aria-hidden="true" />
                {{ t('explore.index.features.access.badge') }}
              </div>
              <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
            </div>
            <div class="font-extrabold title-gradient">{{ t('explore.index.features.access.title') }}</div>
            <p class="text-sm text-muted">{{ t('explore.index.features.access.desc') }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- MODULES -->
    <div class="card js-reveal">
      <div class="card-body">
        <div class="flex items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="font-extrabold title-gradient">{{ t('explore.index.modules.title') }}</div>
            <div class="text-sm text-muted">{{ t('explore.index.modules.subtitle') }}</div>
          </div>
          <div class="badge">
            <Icon name="mdi:apps" aria-hidden="true" />
            {{ t('explore.index.modules.badge') }}
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
          <NuxtLink :to="localePath('/explore/characters')" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-earth">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:account-group-outline" aria-hidden="true" />
                    {{ t('explore.index.modules.cards.characters.title') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="text-sm text-muted">{{ t('explore.index.modules.cards.characters.desc') }}</div>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/scenes')" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-forest">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:movie-open" aria-hidden="true" />
                    {{ t('explore.index.modules.cards.scenes.title') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="text-sm text-muted">{{ t('explore.index.modules.cards.scenes.desc') }}</div>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/timeline')" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-river">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:timeline" aria-hidden="true" />
                    {{ t('explore.index.modules.cards.timeline.title') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="text-sm text-muted">{{ t('explore.index.modules.cards.timeline.desc') }}</div>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink :to="localePath('/explore/glossary')" class="card-link js-reveal">
            <div class="card card-hover bg-surface2 card-accent accent-copper">
              <div class="card-body space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="badge badge-accent w-fit">
                    <Icon name="mdi:book-open-page-variant-outline" aria-hidden="true" />
                    {{ t('explore.index.modules.cards.glossary.title') }}
                  </div>
                  <Icon name="mdi:arrow-right" class="text-xl opacity-60" aria-hidden="true" />
                </div>
                <div class="text-sm text-muted">{{ t('explore.index.modules.cards.glossary.desc') }}</div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- WORKFLOW -->
    <NuxtLink :to="localePath('/explore/workflow')" class="card-link js-reveal">
      <div class="card card-hover card-accent accent-forest overflow-hidden">
        <div class="card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="space-y-1">
            <div class="badge badge-accent w-fit">
              <Icon name="mdi:rocket-launch-outline" aria-hidden="true" />
              {{ t('explore.index.workflow.badge') }}
            </div>
            <div class="font-extrabold text-lg title-gradient">{{ t('explore.index.workflow.title') }}</div>
            <p class="text-sm text-muted">{{ t('explore.index.workflow.desc') }}</p>
          </div>
          <div class="btn btn-ghost">
            {{ t('explore.index.workflow.cta') }}
            <Icon name="mdi:arrow-right" aria-hidden="true" />
          </div>
        </div>
      </div>
    </NuxtLink>
  </section>
</template>

<style scoped>
.js-reveal {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 420ms ease, transform 420ms ease;
  transition-delay: var(--reveal-delay, 0ms);
}
.js-reveal.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Pour rendre les NuxtLink “cards” clean */
.card-link { display: block; text-decoration: none; color: inherit; }
</style>
