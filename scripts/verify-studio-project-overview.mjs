import { readFileSync } from 'node:fs'
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'

const component = 'app/pages/studio/projects/[slug]/index.vue'
const source = readFileSync(component, 'utf8')
const { descriptor, errors } = parse(source, { filename: component })

if (errors.length) throw new Error(errors.join('\n'))

const script = compileScript(descriptor, { id: 'sonekeno-project-overview' })
const template = compileTemplate({
  source: descriptor.template.content,
  filename: component,
  id: 'sonekeno-project-overview',
  bindingMetadata: script.bindings,
})

if (template.errors.length) throw new Error(template.errors.join('\n'))

const requiredKeys = [
  'overviewKicker',
  'overviewTitle',
  'overviewLead',
  'reviewScenes',
  'nextActionKicker',
  'nextActionCta',
  'nextKicker',
  'nextTitle',
]

for (const locale of ['fr', 'en', 'pt']) {
  const messages = JSON.parse(readFileSync(`i18n/locales/${locale}.json`, 'utf8'))
  for (const key of requiredKeys) {
    if (!messages.studio?.project?.[key]) {
      throw new Error(`${locale} is missing studio.project.${key}`)
    }
  }
  for (const area of ['books', 'characters', 'scenes', 'timeline']) {
    for (const key of ['title', 'lead']) {
      if (!messages.studio?.project?.nextAction?.[area]?.[key]) {
        throw new Error(`${locale} is missing studio.project.nextAction.${area}.${key}`)
      }
    }
  }
}

console.log('Sonekeno project overview component + i18n PASS')
