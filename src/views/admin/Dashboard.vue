<template>
  <div class="space-y-8">
    <section class="relative overflow-hidden rounded-[28px] border border-slate-200 bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 px-5 py-6 text-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.85)] sm:px-8 sm:py-8">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_30%)]"></div>
      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div class="max-w-3xl">
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-emerald-200/80">Operations Overview</p>
          <h1 class="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Welcome back to Modulux Admin</h1>
          <p class="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Monitor content, review key numbers, and respond to new enquiries from one streamlined dashboard.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:min-w-[520px] xl:max-w-[640px] xl:flex-1 xl:grid-cols-4">
          <RouterLink
            to="/admin/projects"
            class="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/14"
          >
            <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">Projects</p>
            <p class="mt-3 text-2xl font-semibold text-white">
              <span v-if="loadingProjects" class="text-slate-400">...</span>
              <span v-else>{{ totalProjects }}</span>
            </p>
          </RouterLink>
          <RouterLink
            to="/admin/blogs"
            class="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/14"
          >
            <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">Blogs</p>
            <p class="mt-3 text-2xl font-semibold text-white">
              <span v-if="loadingBlogs" class="text-slate-400">...</span>
              <span v-else>{{ totalBlogs }}</span>
            </p>
          </RouterLink>
          <RouterLink
            to="/admin/contacts"
            class="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/14"
          >
            <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">Enquiries</p>
            <p class="mt-3 text-2xl font-semibold text-white">
              <span v-if="loadingInquiries" class="text-slate-400">...</span>
              <span v-else>{{ totalInquiries }}</span>
            </p>
          </RouterLink>
          <RouterLink
            to="/admin/subscribers"
            class="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/14"
          >
            <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">Subscribers</p>
            <p class="mt-3 text-2xl font-semibold text-white">
              <span v-if="loadingSubscribers" class="text-slate-400">...</span>
              <span v-else>{{ totalSubscribers }}</span>
            </p>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <RouterLink
        v-for="card in statCards"
        :key="card.title"
        :to="card.to"
        class="group block rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_20px_50px_-30px_rgba(15,23,42,0.5)]"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{{ card.eyebrow }}</p>
            <h2 class="mt-3 text-sm font-medium text-slate-500">{{ card.title }}</h2>
            <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              <span v-if="card.loading" class="text-slate-300">...</span>
              <span v-else>{{ card.value }}</span>
            </p>
          </div>
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl" :class="card.iconWrapperClass">
            <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path :d="card.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
            </svg>
          </div>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-500">{{ card.description }}</p>
      </RouterLink>
    </section>

    <section class="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <section class="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Audience</p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Latest subscribers</h2>
          </div>
          <RouterLink
            to="/admin/subscribers"
            class="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
          >
            View all
          </RouterLink>
        </div>

        <div v-if="loadingRecentSubscribers" class="space-y-4">
          <div v-for="item in 5" :key="item" class="h-20 animate-pulse rounded-2xl bg-slate-100"></div>
        </div>

        <div
          v-else-if="recentSubscribers.length === 0"
          class="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm font-medium text-slate-500"
        >
          No subscribers available yet.
        </div>

        <div v-else class="space-y-4">
          <article
            v-for="subscriber in recentSubscribers"
            :key="subscriber.id"
            class="rounded-2xl border border-slate-200 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
          >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0 flex-1">
                <h3 class="text-base font-semibold text-slate-900">
                  {{ subscriber.first_name }} {{ subscriber.last_name }}
                </h3>
                <div class="mt-3 space-y-1 text-sm text-slate-500">
                  <p class="break-all">{{ subscriber.email }}</p>
                  <p>{{ subscriber.phone || 'No phone number' }}</p>
                </div>
              </div>

              <div class="sm:text-right">
                <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Joined</p>
                <p class="mt-1 text-sm text-slate-500">{{ formatDate(subscriber.created_at) }}</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Recent Content</p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Latest blogs</h2>
          </div>
          <RouterLink
            to="/admin/blogs"
            class="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
          >
            View all
          </RouterLink>
        </div>

        <div v-if="loadingRecentBlogs" class="space-y-4">
          <div v-for="item in 5" :key="item" class="h-24 animate-pulse rounded-2xl bg-slate-100"></div>
        </div>

        <div
          v-else-if="recentBlogs.length === 0"
          class="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm font-medium text-slate-500"
        >
          No blogs available yet.
        </div>

        <div v-else class="space-y-4">
          <article
            v-for="blog in recentBlogs"
            :key="blog.id"
            class="rounded-2xl border border-slate-200 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
          >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-base font-semibold text-slate-900">
                    {{ blog.title }}
                  </h3>
                  <span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {{ blog.type }}
                  </span>
                </div>
                <p class="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                  {{ blog.excerpt || 'No excerpt available.' }}
                </p>
                <a
                  :href="blog.source_url"
                  target="_blank"
                  rel="noreferrer"
                  class="mt-3 inline-flex max-w-full items-center text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                >
                  Source link
                </a>
              </div>

              <div class="sm:text-right">
                <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Updated</p>
                <p class="mt-1 text-sm text-slate-500">{{ formatDate(blog.updated_at) }}</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </section>

    <section class="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Recent Enquiries</p>
          <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Latest 5 enquiries</h2>
        </div>
        <RouterLink
          to="/admin/contacts"
          class="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
        >
          View all
        </RouterLink>
      </div>

      <div v-if="loadingRecentContacts" class="space-y-4">
        <div v-for="item in 5" :key="item" class="h-24 animate-pulse rounded-2xl bg-slate-100"></div>
      </div>

      <div
        v-else-if="recentContacts.length === 0"
        class="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm font-medium text-slate-500"
      >
        No enquiries available yet.
      </div>

      <div v-else class="space-y-4">
        <article
          v-for="contact in recentContacts"
          :key="contact.id"
          class="rounded-2xl border border-slate-200 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 sm:p-5"
        >
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2.5">
                <h3 class="text-base font-semibold text-slate-900">
                  {{ contact.first_name }} {{ contact.last_name }}
                </h3>
                <span :class="statusBadgeClass(contact.status)">
                  {{ contact.status }}
                </span>
                <span :class="typeBadgeClass(contact.enquiry_type)">
                  {{ typeLabel(contact.enquiry_type) }}
                </span>
              </div>

              <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                <span class="break-all">{{ contact.email }}</span>
                <span>{{ formatPhone(contact.country_code, contact.phone) }}</span>
              </div>

              <p v-if="contact.message" class="mt-4 line-clamp-2 text-sm leading-7 text-slate-600">
                {{ contact.message }}
              </p>
              <p v-else class="mt-4 text-sm italic text-slate-400">No message provided.</p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between lg:min-w-[220px] lg:flex-col lg:items-end lg:text-right">
              <div>
                <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Created</p>
                <p class="mt-1 text-sm text-slate-500">{{ formatDate(contact.created_at) }}</p>
              </div>

              <div class="flex flex-wrap items-center gap-2 lg:justify-end">
                <button
                  v-if="contact.status === 'new'"
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="isUpdatingContact(contact.id)"
                  @click="updateContactStatus(contact.id, 'read')"
                >
                  <svg
                    v-if="isUpdatingContact(contact.id)"
                    class="h-3.5 w-3.5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" />
                    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-linecap="round" stroke-width="3" />
                  </svg>
                  {{ isUpdatingContact(contact.id) ? 'Updating...' : 'Mark as read' }}
                </button>
                <button
                  type="button"
                  class="inline-flex items-center rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  :disabled="isUpdatingContact(contact.id)"
                  @click="openDetail(contact)"
                >
                  Open detail
                </button>
                <a
                  :href="replyLaterLink(contact)"
                  class="inline-flex items-center rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                >
                  Reply later
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="selectedContact"
        class="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4"
        @click.self="closeDetail"
      >
        <div class="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" @click="closeDetail"></div>

        <div class="relative z-10 w-full max-w-3xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_-36px_rgba(15,23,42,0.55)]">
          <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Enquiry Detail</p>
              <h3 class="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                {{ selectedContact.first_name }} {{ selectedContact.last_name }}
              </h3>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <span :class="statusBadgeClass(selectedContact.status)">
                  {{ selectedContact.status }}
                </span>
                <span :class="typeBadgeClass(selectedContact.enquiry_type)">
                  {{ typeLabel(selectedContact.enquiry_type) }}
                </span>
              </div>
            </div>

            <button
              type="button"
              class="rounded-2xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
              @click="closeDetail"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="m6 6 12 12M18 6 6 18" stroke-linecap="round" />
              </svg>
            </button>
          </div>

          <div class="max-h-[78vh] overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
            <div class="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div class="space-y-5">
                <div class="rounded-2xl bg-slate-50 p-5">
                  <h4 class="text-sm font-semibold text-slate-700">Message</h4>
                  <p v-if="selectedContact.message" class="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {{ selectedContact.message }}
                  </p>
                  <p v-else class="mt-3 text-sm italic text-slate-400">No message provided.</p>
                </div>

                <div
                  v-if="selectedContact.enquiry_type === 'project' && selectedContact.building_type"
                  class="rounded-2xl border border-amber-100 bg-amber-50 p-5"
                >
                  <h4 class="text-sm font-semibold text-amber-800">Project Details</h4>
                  <div class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p class="text-amber-600">Building type</p>
                      <p class="mt-1 font-medium text-slate-900">{{ selectedContact.building_type }}</p>
                    </div>
                    <div>
                      <p class="text-amber-600">Living units</p>
                      <p class="mt-1 font-medium text-slate-900">{{ selectedContact.living_units || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-amber-600">Area</p>
                      <p class="mt-1 font-medium text-slate-900">{{ selectedContact.area || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-amber-600">Arrange tour</p>
                      <p class="mt-1 font-medium text-slate-900">{{ selectedContact.arrange_tour ? 'Yes' : 'No' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-5">
                <div class="rounded-2xl border border-slate-200 p-5">
                  <h4 class="text-sm font-semibold text-slate-700">Contact Information</h4>
                  <div class="mt-4 space-y-3 text-sm">
                    <div>
                      <p class="text-slate-400">Email</p>
                      <a :href="`mailto:${selectedContact.email}`" class="mt-1 inline-flex break-all font-medium text-emerald-700 hover:text-emerald-800">
                        {{ selectedContact.email }}
                      </a>
                    </div>
                    <div>
                      <p class="text-slate-400">Phone</p>
                      <p class="mt-1 font-medium text-slate-900">
                        {{ formatPhone(selectedContact.country_code, selectedContact.phone) }}
                      </p>
                    </div>
                    <div>
                      <p class="text-slate-400">Submitted</p>
                      <p class="mt-1 font-medium text-slate-900">{{ formatDate(selectedContact.created_at) }}</p>
                    </div>
                    <div>
                      <p class="text-slate-400">Source</p>
                      <p class="mt-1 font-medium text-slate-900">{{ selectedContact.source || 'Not provided' }}</p>
                    </div>
                  </div>
                </div>

                <div class="rounded-2xl border border-slate-200 p-5">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <h4 class="text-sm font-semibold text-slate-700">Quick Actions</h4>
                      <p v-if="isUpdatingContact(selectedContact.id)" class="mt-1 text-xs font-medium text-amber-600">
                        Saving changes...
                      </p>
                    </div>
                    <div class="relative">
                      <select
                        :value="selectedContact.status"
                        class="rounded-xl border border-slate-200 bg-white px-3 py-2 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        :disabled="isUpdatingContact(selectedContact.id)"
                        @change="handleSelectedContactStatusChange"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                      <svg
                        v-if="isUpdatingContact(selectedContact.id)"
                        class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-emerald-600"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" />
                        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-linecap="round" stroke-width="3" />
                      </svg>
                    </div>
                  </div>

                  <div class="mt-4 flex flex-wrap gap-3">
                    <button
                      v-if="selectedContact.status === 'new'"
                      type="button"
                      class="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                      :disabled="isUpdatingContact(selectedContact.id)"
                      @click="updateContactStatus(selectedContact.id, 'read')"
                    >
                      <svg
                        v-if="isUpdatingContact(selectedContact.id)"
                        class="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity="0.25" stroke-width="3" />
                        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-linecap="round" stroke-width="3" />
                      </svg>
                      {{ isUpdatingContact(selectedContact.id) ? 'Updating...' : 'Mark as read' }}
                    </button>
                    <a
                      :href="replyLaterLink(selectedContact)"
                      class="inline-flex items-center rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100"
                    >
                      Reply later
                    </a>
                    <RouterLink
                      to="/admin/contacts"
                      class="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      @click="closeDetail"
                    >
                      Open full page
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-3 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-3 opacity-0"
    >
      <div
        v-if="toast.visible"
        class="pointer-events-none fixed right-5 top-5 z-[70] w-full max-w-sm"
      >
        <div
          class="pointer-events-auto overflow-hidden rounded-[22px] border bg-white/95 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl"
          :class="toastClass"
        >
          <div class="flex items-start gap-3 px-4 py-4">
            <div class="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl" :class="toastIconClass">
              <svg v-if="toast.type === 'success'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-slate-950">{{ toast.title }}</p>
              <p class="mt-1 text-sm leading-6 text-slate-600">{{ toast.message }}</p>
            </div>
            <button
              type="button"
              class="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              @click="hideToast"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="m6 6 12 12M18 6 6 18" stroke-linecap="round" />
              </svg>
            </button>
          </div>
          <div class="h-1 w-full" :class="toastProgressClass"></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import api from '@/services/api'
import { getBlogs } from '@/services/blogApi'

const totalProjects = ref(0)
const totalBlogs = ref(0)
const totalInquiries = ref(0)
const totalSubscribers = ref(0)
const recentContacts = ref([])
const recentSubscribers = ref([])
const recentBlogs = ref([])

const selectedContact = ref(null)
const updatingContactIds = ref([])

const toast = ref({
  visible: false,
  type: 'success',
  title: '',
  message: '',
})

let toastTimeoutId = null

const loadingProjects = ref(true)
const loadingBlogs = ref(true)
const loadingInquiries = ref(true)
const loadingSubscribers = ref(true)
const loadingRecentContacts = ref(true)
const loadingRecentSubscribers = ref(true)
const loadingRecentBlogs = ref(true)

const statCards = computed(() => [
  {
    eyebrow: 'Projects',
    title: 'Total Projects',
    to: '/admin/projects',
    value: totalProjects.value,
    loading: loadingProjects.value,
    description: 'Track the number of projects currently available in the portfolio.',
    iconWrapperClass: 'bg-emerald-100 text-emerald-600',
    icon: 'M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10',
  },
  {
    eyebrow: 'Content',
    title: 'Total Blogs',
    to: '/admin/blogs',
    value: totalBlogs.value,
    loading: loadingBlogs.value,
    description: 'Keep an eye on how many published and managed articles are live.',
    iconWrapperClass: 'bg-blue-100 text-blue-600',
    icon: 'M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  },
  {
    eyebrow: 'Contacts',
    title: 'Total Enquiries',
    to: '/admin/contacts',
    value: totalInquiries.value,
    loading: loadingInquiries.value,
    description: 'Monitor incoming leads and contact form submissions in real time.',
    iconWrapperClass: 'bg-violet-100 text-violet-600',
    icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9',
  },
  {
    eyebrow: 'Audience',
    title: 'Total Subscribers',
    to: '/admin/subscribers',
    value: totalSubscribers.value,
    loading: loadingSubscribers.value,
    description: 'Track newsletter signups collected from the public website.',
    iconWrapperClass: 'bg-amber-100 text-amber-600',
    icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  },
])

const toastClass = computed(() => {
  return toast.value.type === 'success'
    ? 'border-emerald-100'
    : 'border-rose-100'
})

const toastIconClass = computed(() => {
  return toast.value.type === 'success'
    ? 'bg-emerald-100 text-emerald-600'
    : 'bg-rose-100 text-rose-600'
})

const toastProgressClass = computed(() => {
  return toast.value.type === 'success'
    ? 'bg-linear-to-r from-emerald-400 via-emerald-500 to-teal-500'
    : 'bg-linear-to-r from-rose-400 via-rose-500 to-orange-400'
})

const showToast = ({ type = 'success', title, message }) => {
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId)
  }

  toast.value = {
    visible: true,
    type,
    title,
    message,
  }

  toastTimeoutId = window.setTimeout(() => {
    hideToast()
  }, 3200)
}

const hideToast = () => {
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId)
    toastTimeoutId = null
  }

  toast.value.visible = false
}

const fetchProjects = async () => {
  try {
    const response = await api.get('/api/v1/projects/')
    totalProjects.value = response.data?.length || 0
  } catch (error) {
    console.error('Failed to fetch projects', error)
  } finally {
    loadingProjects.value = false
  }
}

const fetchBlogs = async () => {
  try {
    const response = await getBlogs({ page: 1, page_size: 50 })
    totalBlogs.value = response.total || 0
  } catch (error) {
    console.error('Failed to fetch blogs', error)
  } finally {
    loadingBlogs.value = false
  }
}

const fetchInquiryStats = async () => {
  try {
    const response = await api.get('/api/v1/contacts/stats')
    totalInquiries.value = response.data?.all || 0
  } catch (error) {
    console.error('Failed to fetch enquiry stats', error)
  } finally {
    loadingInquiries.value = false
  }
}

const fetchSubscribersCount = async () => {
  try {
    const response = await api.get('/api/v1/subscribers/', {
      params: {
        skip: 0,
        limit: 1000,
      },
    })
    totalSubscribers.value = Array.isArray(response.data) ? response.data.length : 0
  } catch (error) {
    console.error('Failed to fetch subscribers', error)
  } finally {
    loadingSubscribers.value = false
  }
}

const fetchContacts = async () => {
  try {
    const response = await api.get('/api/v1/contacts/', {
      params: {
        skip: 0,
        limit: 5,
      },
    })
    recentContacts.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to fetch contacts', error)
  } finally {
    loadingRecentContacts.value = false
  }
}

const fetchRecentSubscribers = async () => {
  try {
    const response = await api.get('/api/v1/subscribers/', {
      params: {
        skip: 0,
        limit: 5,
      },
    })
    recentSubscribers.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to fetch recent subscribers', error)
  } finally {
    loadingRecentSubscribers.value = false
  }
}

const fetchRecentBlogs = async () => {
  try {
    const response = await getBlogs({ page: 1, page_size: 5 })
    recentBlogs.value = Array.isArray(response.items) ? response.items : []
  } catch (error) {
    console.error('Failed to fetch recent blogs', error)
  } finally {
    loadingRecentBlogs.value = false
  }
}

const syncContactStatus = (id, status) => {
  const target = recentContacts.value.find((contact) => contact.id === id)

  if (target) target.status = status

  if (selectedContact.value?.id === id) selectedContact.value.status = status
}

const isUpdatingContact = (id) => updatingContactIds.value.includes(id)

const updateContactStatus = async (id, status) => {
  if (isUpdatingContact(id)) return

  updatingContactIds.value = [...updatingContactIds.value, id]

  try {
    await api.put(`/api/v1/contacts/${id}`, { status })
    syncContactStatus(id, status)

    showToast({
      type: 'success',
      title: 'Status updated',
      message: `Enquiry status has been changed to ${status}.`,
    })
  } catch (error) {
    console.error('Failed to update contact status', error)

    showToast({
      type: 'error',
      title: 'Update failed',
      message: 'We could not save the enquiry status. Please try again.',
    })
  } finally {
    updatingContactIds.value = updatingContactIds.value.filter((item) => item !== id)
  }
}

const openDetail = async (contact) => {
  selectedContact.value = { ...contact }

  if (contact.status === 'new') {
    await updateContactStatus(contact.id, 'read')
  }
}

const closeDetail = () => {
  selectedContact.value = null
}

const replyLaterLink = (contact) => {
  const subject = encodeURIComponent('Re: Your Modulux enquiry')
  const body = encodeURIComponent(
    `Hi ${contact.first_name || ''},\n\nThank you for contacting Modulux. We have received your enquiry and will follow up with you shortly.\n\nBest regards,\nModulux Team`
  )

  return `mailto:${contact.email}?subject=${subject}&body=${body}`
}

const handleSelectedContactStatusChange = (event) => {
  const nextStatus = event?.target?.value

  if (!selectedContact.value?.id || !nextStatus) return

  updateContactStatus(selectedContact.value.id, nextStatus)
}

const formatDate = (date) => {
  if (!date) return 'N/A'

  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatPhone = (countryCode, phone) => {
  if (!phone) return 'No phone number'
  return [countryCode, phone].filter(Boolean).join(' ')
}

const typeLabel = (type) => {
  const map = {
    home_general: 'Home',
    general: 'General',
    project: 'Project',
  }

  return map[type] || type || 'General'
}

const statusBadgeClass = (status) => {
  const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize'
  const map = {
    new: 'bg-emerald-100 text-emerald-700',
    read: 'bg-amber-100 text-amber-700',
    replied: 'bg-blue-100 text-blue-700',
    archived: 'bg-slate-100 text-slate-500',
  }

  return `${base} ${map[status] || 'bg-slate-100 text-slate-500'}`
}

const typeBadgeClass = (type) => {
  const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold'
  const map = {
    home_general: 'bg-emerald-100 text-emerald-700',
    general: 'bg-sky-100 text-sky-700',
    project: 'bg-amber-100 text-amber-700',
  }

  return `${base} ${map[type] || 'bg-slate-100 text-slate-500'}`
}

onMounted(async () => {
  await Promise.allSettled([
    fetchProjects(),
    fetchBlogs(),
    fetchInquiryStats(),
    fetchSubscribersCount(),
    fetchContacts(),
    fetchRecentSubscribers(),
    fetchRecentBlogs(),
  ])
})

onBeforeUnmount(() => {
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId)
  }
})
</script>
