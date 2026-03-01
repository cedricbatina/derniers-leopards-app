<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useLocalePath, useRequestHeaders } from '#imports'

const props = defineProps({
  apiBase: { type: String, required: true }, // ex: /api/todos or /api/projects/slug/todos
  contextLabel: { type: String, default: 'Todos' },
  backTo: { type: String, default: '' },
  backLabel: { type: String, default: 'Back' },
  showProject: { type: Boolean, default: false }, // Show project column in list
})

const localePath = useLocalePath()
const q = ref('')
const statusFilter = ref('')
const completed = ref(false)
const creating = ref(false)
const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
  status: 'pending',
})

const queryObj = computed(() => ({
  q: q.value?.trim() || undefined,
  status: statusFilter.value || undefined,
  completed: completed.value ? 1 : undefined,
}))

const { data, pending, refresh, error } = await useFetch(
  () => `${props.apiBase}`,
  { $fetch: apiFetch, query: queryObj, credentials: 'include', headers: useRequestHeaders(['cookie']) }
)

const todos = computed(() => data.value?.todos || [])
const project = computed(() => data.value?.project || null)

async function createTodo() {
  if (!form.title.trim()) return
  creating.value = true
  try {
    await apiFetch(`${props.apiBase}`, {
      method: 'POST',
      body: {
        title: form.title,
        description: form.description || undefined,
        priority: form.priority,
        due_date: form.due_date || undefined,
        status: form.status,
      },
    })
    form.title = ''
    form.description = ''
    form.priority = 'medium'
    form.due_date = ''
    form.status = 'pending'
    await refresh()
  } finally {
    creating.value = false
  }
}

async function toggleComplete(todo) {
  await apiFetch(`/api/todos/${todo.id}/complete`, {
    method: 'POST',
  })
  await refresh()
}

async function updateStatus(todo, newStatus) {
  await apiFetch(`/api/todos/${todo.id}`, {
    method: 'PUT',
    body: { status: newStatus },
  })
  await refresh()
}

async function updatePriority(todo, newPriority) {
  await apiFetch(`/api/todos/${todo.id}`, {
    method: 'PUT',
    body: { priority: newPriority },
  })
  await refresh()
}

async function deleteTodo(todo) {
  if (!confirm(`Delete todo "${todo.title}"?`)) return
  await apiFetch(`/api/todos/${todo.id}`, {
    method: 'DELETE',
  })
  await refresh()
}

function priorityColor(priority) {
  switch (priority) {
    case 'high': return 'text-red-600 font-bold'
    case 'medium': return 'text-yellow-600'
    case 'low': return 'text-gray-500'
    default: return ''
  }
}

function priorityLabel(priority) {
  switch (priority) {
    case 'high': return '🔴 High'
    case 'medium': return '🟡 Medium'
    case 'low': return '⚪ Low'
    default: return priority
  }
}

function statusBadge(status) {
  switch (status) {
    case 'completed': return 'badge badge-success'
    case 'in-progress': return 'badge badge-warning'
    case 'pending': return 'badge badge-ghost'
    default: return 'badge'
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })
}

function isOverdue(dueDate) {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}
</script>

<template>
  <div class="page space-y-4">
    <NuxtLink v-if="props.backTo" class="text-sm text-muted hover:opacity-100" :to="localePath(props.backTo)">
      ← {{ props.backLabel }}
    </NuxtLink>

    <div class="flex items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold">{{ props.contextLabel }}</h1>
        <p v-if="project" class="text-sm text-muted">Project: {{ project.title }}</p>
        <p v-else class="text-sm text-muted">Manage your writing tasks</p>
      </div>
      <label class="text-sm text-muted flex items-center gap-2 select-none">
        <input type="checkbox" v-model="completed" />
        Show completed
      </label>
    </div>

    <!-- Create form -->
    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-6">
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Task title *</label>
          <input v-model="form.title" class="input w-full" placeholder="e.g. Write chapter 5" />
        </div>
        <div class="md:col-span-2">
          <label class="text-xs text-muted">Description</label>
          <input v-model="form.description" class="input w-full" placeholder="Optional details…" />
        </div>
        <div class="md:col-span-1">
          <label class="text-xs text-muted">Priority</label>
          <select v-model="form.priority" class="input w-full">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div class="md:col-span-1">
          <label class="text-xs text-muted">Due date</label>
          <input type="date" v-model="form.due_date" class="input w-full" />
        </div>
        <div class="md:col-span-6">
          <button class="btn btn-primary w-full focus-ring" :disabled="creating || !form.title.trim()" @click="createTodo">
            <Icon name="mdi:plus" aria-hidden="true" />
            Create Todo
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <div class="card-body grid gap-3 md:grid-cols-2">
        <div>
          <label class="text-xs text-muted">Search</label>
          <input v-model="q" class="input w-full" placeholder="Search todos…" />
        </div>
        <div>
          <label class="text-xs text-muted">Status filter</label>
          <select v-model="statusFilter" class="input w-full">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="error" class="card">
      <div class="card-body text-sm">Error: {{ error?.statusMessage || error }}</div>
    </div>

    <div class="card overflow-hidden">
      <div class="card-body flex items-center justify-between">
        <div class="text-sm text-muted">
          <span v-if="pending">Loading…</span>
          <span v-else>{{ todos.length }} todo(s){{ completed ? ' (completed)' : '' }}</span>
        </div>
      </div>

      <div v-if="!pending && todos.length > 0">
        <div class="overflow-x-auto">
          <table class="table w-full">
            <thead>
              <tr>
                <th class="w-12">✓</th>
                <th>Title</th>
                <th v-if="showProject">Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="todo in todos" :key="todo.id" :class="{ 'opacity-60': todo.completed_at }">
                <td>
                  <input
                    type="checkbox"
                    :checked="!!todo.completed_at"
                    @change="toggleComplete(todo)"
                    class="checkbox checkbox-sm"
                  />
                </td>
                <td>
                  <div class="font-medium" :class="{ 'line-through': todo.completed_at }">
                    {{ todo.title }}
                  </div>
                  <div v-if="todo.description" class="text-xs text-muted">{{ todo.description }}</div>
                  <div v-if="todo.character_name || todo.scene_title" class="text-xs text-muted mt-1">
                    <span v-if="todo.character_name">👤 {{ todo.character_name }}</span>
                    <span v-if="todo.scene_title" class="ml-2">🎬 {{ todo.scene_title }}</span>
                  </div>
                </td>
                <td v-if="showProject">
                  <span v-if="todo.project_title" class="text-sm">{{ todo.project_title }}</span>
                </td>
                <td>
                  <select
                    :value="todo.priority"
                    @change="updatePriority(todo, $event.target.value)"
                    class="select select-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </td>
                <td>
                  <select
                    :value="todo.status"
                    @change="updateStatus(todo, $event.target.value)"
                    class="select select-sm"
                    :disabled="!!todo.completed_at"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td>
                  <span v-if="todo.due_date" :class="{ 'text-red-600 font-bold': isOverdue(todo.due_date) && !todo.completed_at }">
                    {{ formatDate(todo.due_date) }}
                  </span>
                </td>
                <td class="text-right">
                  <button
                    class="btn btn-xs btn-ghost text-error"
                    @click="deleteTodo(todo)"
                    title="Delete"
                  >
                    <Icon name="mdi:delete" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else-if="!pending && todos.length === 0" class="card-body text-center text-muted">
        No todos found
      </div>
    </div>
  </div>
</template>
