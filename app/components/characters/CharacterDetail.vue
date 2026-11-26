<script setup>
import { computed, ref, reactive, watch } from 'vue'
import { useLocalePath, useRequestHeaders } from '#imports'
import { isNarrativeAccessDenied } from '~/utils/narrativeAccess'

const props = defineProps({
  apiBase: { type: String, required: true }, // ex: /api/projects/slug/characters
  characterSlug: { type: String, required: true },
  backTo: { type: String, default: '' },
  backLabel: { type: String, default: 'Back' },
})

const localePath = useLocalePath()
const { t } = useI18n()
const editing = ref(false)
const saving = ref(false)
const saveError = ref(null)
const form = reactive({ name: '', slug: '', description: '' })

const { data, pending, refresh, error: loadError } = await useFetch(
  () => `${props.apiBase}/${props.characterSlug}`,
  { $fetch: apiFetch, credentials: 'include', headers: useRequestHeaders(['cookie']) }
)
const canManage = computed(() => data.value?.can_manage !== false)
const rawDescription = computed(() => data.value?.character?.description || '')
const descriptionIsArchive = computed(() => /(?:FICHE CANON|Rectificatif Founder|Corrections Founder|MATIÈRE BRUTE|Source canon GitHub)/i.test(rawDescription.value))
const archiveText = computed(() => [descriptionIsArchive.value ? rawDescription.value : '', data.value?.canon?.dossier?.notes].filter(Boolean).join('\n\n'))
const kinships = computed(() => {
  const unique = new Map()
  for (const link of data.value?.canon?.kinships || []) {
    const key = link.slug+'|'+link.relation+'|'+link.line
    if (!unique.has(key)) unique.set(key,link)
  }
  return [...unique.values()]
})
const profileFields = computed(() => [
  [t('characters.detail.roleInStory'), data.value?.canon?.profile?.role_in_story],
  [t('characters.detail.oneLiner'), data.value?.canon?.profile?.one_liner],
  ['Naissance / Birth', data.value?.canon?.profile?.birth_year],
  ['Portrait physique / Physical description', data.value?.canon?.profile?.physical],
  ['Voix / Voice', data.value?.canon?.profile?.voice],
  [t('characters.detail.occupation'), data.value?.canon?.profile?.occupation],
  [t('characters.detail.personality'), data.value?.canon?.profile?.personality],
  [t('characters.detail.strengths'), data.value?.canon?.profile?.strengths],
  [t('characters.detail.flaws'), data.value?.canon?.profile?.flaws],
  [t('characters.detail.externalGoal'), data.value?.canon?.profile?.goals_external],
  [t('characters.detail.internalGoal'), data.value?.canon?.profile?.goals_internal],
  [t('characters.detail.fears'), data.value?.canon?.profile?.fears],
].filter(([, value]) => value))
const dossierFields = computed(() => [
  [t('characters.detail.desire'), data.value?.canon?.dossier?.desire],
  [t('characters.detail.fear'), data.value?.canon?.dossier?.fear],
  [t('characters.detail.mask'), data.value?.canon?.dossier?.mask],
  [t('characters.detail.weapon'), data.value?.canon?.dossier?.weapon],
  [t('characters.detail.rupture'), data.value?.canon?.dossier?.rupture],
  [t('characters.detail.contradiction'), data.value?.canon?.dossier?.contradiction],
].filter(([, value]) => value))

watch(
  () => loadError.value,
  async (err) => {
    if (!import.meta.client || !err || !isNarrativeAccessDenied(err)) return
    await navigateTo(
      { path: localePath({ name: 'access-denied' }), query: { reason: 'forbidden' } },
      { replace: true },
    )
  },
  { immediate: true },
)

watch(
  () => data.value,
  (val) => {
    if (val?.character) {
      form.name = val.character.name
      form.slug = val.character.slug
      form.description = val.character.description || ''
    }
  },
  { immediate: true }
)

async function save() {
  saving.value = true
  saveError.value = null
  try {
    await apiFetch(`${props.apiBase}/${props.characterSlug}`, {
      method: 'PATCH',
      body: {
        name: form.name,
        slug: form.slug,
        description: form.description,
      },
    })
    editing.value = false
    await refresh()
  } catch (e) {
    saveError.value = e?.statusMessage || e
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink v-if="props.backTo" class="text-sm text-muted hover:opacity-100" :to="localePath(props.backTo)">
      ← {{ props.backLabel }}
    </NuxtLink>
    <div class="flex items-center justify-between gap-3">
      <h1 class="text-xl font-semibold flex items-center gap-2">
        <Icon name="mdi:account" aria-hidden="true" />
        <span>Character: {{ data?.character?.name || '...' }}</span>
      </h1>
      <button v-if="canManage && !editing" class="btn btn-ghost focus-ring" @click="editing = true">
        <Icon name="mdi:pencil" aria-hidden="true" /> Edit
      </button>
    </div>
    <div v-if="saveError" class="alert alert-error">{{ saveError }}</div>
    <div v-if="editing" class="card">
      <div class="card-body space-y-4">
        <div class="grid gap-4 md:grid-cols-6">
        <div>
          <label class="text-xs font-medium text-muted mb-1.5 block">Name</label>
          <div class="relative">
            <Icon name="mdi:account-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input v-model="form.name" class="input w-full pl-10" placeholder="e.g. Kualu" />
          </div>
        </div>
        <div class="md:col-span-2">
          <label class="text-xs font-medium text-muted mb-1.5 block">Slug</label>
          <div class="relative">
            <Icon name="mdi:link-variant" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input v-model="form.slug" class="input w-full pl-10 font-mono" placeholder="kualu" />
          </div>
        </div>
        <div class="md:col-span-6">
          <label class="text-xs font-medium text-muted mb-1.5 block">Description</label>
          <textarea
            v-model="form.description"
            class="input w-full min-h-24"
            placeholder="Short description…"
          />
        </div>
        </div>

        <div class="flex items-center justify-end gap-2">
          <button class="btn btn-ghost focus-ring" :disabled="saving" @click="editing = false">
            Cancel
          </button>
          <button class="btn btn-primary focus-ring gap-2" :disabled="saving" @click="save">
            <Icon name="mdi:content-save" aria-hidden="true" />
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="card">
      <div class="card-body">
        <div class="font-bold text-lg">{{ data?.character?.name }}</div>
        <div class="text-xs text-muted mt-1">Slug: {{ data?.character?.slug }}</div>
        <div v-if="rawDescription && !descriptionIsArchive" class="text-sm text-muted mt-1 whitespace-pre-wrap">
          {{ rawDescription }}
        </div>
      </div>
    </div>
    <section v-if="data?.canon?.profile" class="card">
      <div class="card-body space-y-3">
        <h2 class="font-semibold">Arcs narratifs / Narrative arcs</h2>
        <div v-for="(key,index) in ['arc_tome1','arc_tome2','arc_tome3']" :key="key">
          <template v-if="data.canon.profile[key]">
            <h3 class="font-medium">Tome {{ index+1 }}</h3>
            <p class="whitespace-pre-wrap text-sm">{{ data.canon.profile[key] }}</p>
          </template>
        </div>
      </div>
    </section>
    <section v-if="profileFields.length || dossierFields.length || data?.canon?.aliases?.length || data?.canon?.kinships?.length" class="grid gap-4 lg:grid-cols-2">
      <article v-if="profileFields.length" class="card">
        <div class="card-body space-y-3">
          <h2 class="font-semibold">{{ t('characters.detail.canonProfile') }}</h2>
          <dl class="space-y-2 text-sm">
            <template v-for="([label, value]) in profileFields" :key="label">
              <dt class="font-medium">{{ label }}</dt>
              <dd class="whitespace-pre-wrap text-muted">{{ value }}</dd>
            </template>
          </dl>
        </div>
      </article>
      <article v-if="dossierFields.length" class="card">
        <div class="card-body space-y-3">
          <h2 class="font-semibold">{{ t('characters.detail.dramaticMarkers') }}</h2>
          <dl class="space-y-2 text-sm">
            <template v-for="([label, value]) in dossierFields" :key="label">
              <dt class="font-medium">{{ label }}</dt>
              <dd class="whitespace-pre-wrap text-muted">{{ value }}</dd>
            </template>
          </dl>
        </div>
      </article>
      <article v-if="data?.canon?.aliases?.length" class="card">
        <div class="card-body space-y-2">
          <h2 class="font-semibold">{{ t('characters.detail.aliases') }}</h2>
          <ul class="text-sm text-muted space-y-1">
            <li v-for="alias in data.canon.aliases" :key="`${alias.alias}-${alias.alias_type}`">{{ alias.alias }} <span class="text-xs">({{ alias.alias_type }})</span></li>
          </ul>
        </div>
      </article>
      <article v-if="data?.canon?.kinships?.length" class="card">
        <div class="card-body space-y-2">
          <h2 class="font-semibold">{{ t('characters.detail.kinships') }}</h2>
          <ul class="text-sm text-muted space-y-1">
            <li v-for="link in kinships" :key="`${link.slug}-${link.relation}-${link.line}`">{{ link.name }} — {{ link.relation }}</li>
          </ul>
        </div>
      </article>
    </section>
    <details v-if="archiveText && canManage" class="card">
      <summary class="cursor-pointer p-4 font-medium">Archives de travail / Working archives — non canon actif</summary>
      <div class="card-body">
        <p class="text-sm text-muted">Sources historiques, rectificatifs et notes non consolidées.</p>
        <pre class="whitespace-pre-wrap break-words text-sm">{{ archiveText }}</pre>
      </div>
    </details>
  </div>
</template>
