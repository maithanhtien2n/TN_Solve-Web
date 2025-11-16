<script setup lang="ts">
type MenuItem = {
  name: string
  code: string
  icon: string
  size?: number | string
  color?: string
}

defineProps<{ menus: MenuItem[] }>()

const emits = defineEmits(['select'])
</script>

<template>
  <v-menu location="bottom center">
    <template v-slot:activator="{ props }">
      <div v-bind="props">
        <slot />
      </div>
    </template>

    <v-card min-width="200">
      <v-list
        @update:selected="
          (e: any) => {
            emits('select', e[0])
          }
        "
      >
        <v-list-item v-for="(item, index) in menus" :key="index" :value="item.code">
          <div class="d-flex align-center ga-4">
            <v-icon :icon="item.icon" :size="item.size" :color="item.color" />
            <label class="cursor-pointer" :class="`text-${item.color}`">
              {{ item.name }}
            </label>
          </div>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
