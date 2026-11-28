import { readFile } from 'node:fs/promises'

const componentPath = new URL('../app/pages/studio/projects/[slug]/index.vue', import.meta.url)
const component = await readFile(componentPath, 'utf8')

const expectedSpaces = [
  ['books', '/books'],
  ['characters', '/characters'],
  ['scenes', '/scenes'],
  ['timeline', '/timeline'],
]

for (const [key, path] of expectedSpaces) {
  if (!component.includes(`key: '${key}'`)) {
    throw new Error(`Missing narrative space: ${key}`)
  }
  if (!component.includes(`/${'studio/projects/${slug.value}'}${path}`)) {
    throw new Error(`Missing scoped route for ${key}`)
  }
}

if (!component.includes('aria-labelledby="narrative-spaces-heading"')) {
  throw new Error('Narrative spaces section needs an accessible label')
}

if (!component.includes(':aria-label="space.ariaLabel"')) {
  throw new Error('Narrative space links need descriptive accessible names')
}

if (!component.includes(':aria-busy="narrativeSpacesLoading"')) {
  throw new Error('Narrative spaces need to expose their loading state')
}

if (!component.includes('role="status" aria-live="polite"')) {
  throw new Error('Narrative spaces need to announce loading and resolved counts')
}

const readOnlyFields = [
  'form.title',
  'form.status',
  'form.title_en',
  'form.title_pt',
  'form.logline',
  'form.pitch',
]

for (const field of readOnlyFields) {
  const fieldPattern = new RegExp(`v-model="${field}"[^>]*:disabled="!canManage"`)
  if (!fieldPattern.test(component)) {
    throw new Error(`Read-only project field must be disabled: ${field}`)
  }
}

for (const locale of ['fr', 'en', 'pt']) {
  const localePath = new URL(`../i18n/locales/${locale}.json`, import.meta.url)
  const messages = JSON.parse(await readFile(localePath, 'utf8'))
  const project = messages?.studio?.project
  if (!project?.narrativeSpaces || !project?.narrativeSpacesHint || !project?.narrativeSpaceAria || !project?.narrativeSpacesLoading) {
    throw new Error(`Missing narrative spaces copy in ${locale}`)
  }
}

console.log('Studio narrative spaces verification passed.')
