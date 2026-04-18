<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import { UploadCloud, RefreshCw, FileText, X } from "lucide-vue-next";

interface Props {
  modelValue?: File | File[] | null;
  multiple?: boolean;
  accept?: string;
  maxSizeMb?: number;
  label?: string;
  hint?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  accept: "*",
  maxSizeMb: 5,
  id: () => `file-upload-${Math.random().toString(36).substring(2, 9)}`,
});

const emit = defineEmits<{
  "update:modelValue": [value: File | File[] | null];
  error: [message: string];
}>();

const previewUrls = ref<{ file: File; url: string | null }[]>([]);

// Create preview URLs for the current modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    // Clear old URLs
    previewUrls.value.forEach((p) => {
      if (p.url) URL.revokeObjectURL(p.url);
    });

    if (!newVal) {
      previewUrls.value = [];
      return;
    }

    const files = Array.isArray(newVal) ? newVal : [newVal];
    previewUrls.value = files.map((file) => {
      const isImage = file.type.startsWith("image/");
      return {
        file,
        url: isImage ? URL.createObjectURL(file) : null,
      };
    });
  },
  { immediate: true },
);

onUnmounted(() => {
  previewUrls.value.forEach((p) => {
    if (p.url) URL.revokeObjectURL(p.url);
  });
});

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const files = Array.from(target.files);

  // Validate sizes
  for (const file of files) {
    if (file.size > props.maxSizeMb * 1024 * 1024) {
      emit(
        "error",
        `File ${file.name} exceeds the ${props.maxSizeMb}MB maximum size.`,
      );
      // Not resetting target.value if some files fail, but for simplicity let's just abort
      target.value = "";
      return;
    }
  }

  if (props.multiple) {
    const currentFiles = Array.isArray(props.modelValue)
      ? props.modelValue
      : [];
    emit("update:modelValue", [...currentFiles, ...files]);
  } else {
    emit("update:modelValue", files[0] || null);
  }

  // Reset input so the same file can be selected again if removed
  target.value = "";
}

function clearFile(index?: number) {
  if (
    props.multiple &&
    Array.isArray(props.modelValue) &&
    typeof index === "number"
  ) {
    const newFiles = [...props.modelValue];
    newFiles.splice(index, 1);
    emit("update:modelValue", newFiles.length > 0 ? newFiles : null);
  } else {
    emit("update:modelValue", null);
  }
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="label || hint" class="space-y-0.5">
      <label
        v-if="label"
        :for="id"
        class="block text-sm font-semibold text-slate-900"
        >{{ label }}</label
      >
      <p v-if="hint" class="text-xs text-slate-500">{{ hint }}</p>
    </div>

    <!-- Previews for populated files -->
    <div v-if="previewUrls.length > 0" class="space-y-3">
      <div v-if="!multiple" class="space-y-3">
        <!-- Single File Preview -->
        <div
          class="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center"
        >
          <img
            v-if="previewUrls[0]?.url"
            :src="previewUrls[0].url"
            alt="Document Preview"
            class="object-cover w-full h-full"
          />
          <div
            v-else-if="previewUrls[0]?.file"
            class="flex flex-col items-center gap-2 text-slate-500 p-6"
          >
            <FileText class="w-12 h-12 text-primary-500" />
            <span class="text-sm font-medium text-center break-all">{{
              previewUrls[0].file.name
            }}</span>
            <span class="text-xs"
              >{{
                (previewUrls[0].file.size / 1024 / 1024).toFixed(2)
              }}
              MB</span
            >
          </div>
        </div>
        <button
          type="button"
          @click="clearFile()"
          class="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RefreshCw class="w-4 h-4" />
          Change file
        </button>
      </div>

      <!-- Multiple File Previews -->
      <div v-else class="space-y-2">
        <div
          v-for="(preview, index) in previewUrls"
          :key="index"
          class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white"
        >
          <div
            class="w-10 h-10 shrink-0 rounded-md overflow-hidden bg-slate-100 border border-slate-200 flex flex-col justify-center items-center"
          >
            <img
              v-if="preview.url"
              :src="preview.url"
              class="object-cover w-full h-full"
            />
            <FileText v-else class="w-5 h-5 text-slate-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-900 truncate">
              {{ preview.file.name }}
            </p>
            <p class="text-xs text-slate-500">
              {{ (preview.file.size / 1024 / 1024).toFixed(2) }} MB
            </p>
          </div>
          <button
            type="button"
            @click="clearFile(index)"
            class="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-50 shrink-0"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Box (Shown if empty OR if multiple) -->
    <label
      v-if="!modelValue || multiple"
      :for="id"
      class="mt-1 flex justify-center px-6 pt-8 pb-10 border-2 border-slate-200 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
    >
      <div class="space-y-2 text-center text-primary-600">
        <UploadCloud class="mx-auto h-8 w-8" />
        <div class="flex text-sm justify-center">
          <span class="relative font-semibold hover:text-primary-700">
            Tap to upload
            {{
              multiple && modelValue && (modelValue as File[]).length > 0
                ? "more files"
                : ""
            }}
          </span>
          <input
            :id="id"
            type="file"
            class="sr-only"
            :accept="accept"
            :multiple="multiple"
            @change="handleFileChange"
          />
        </div>
        <p class="text-xs text-slate-400">
          <span v-if="accept && accept !== '*'">{{
            accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")
          }}</span>
          <span v-else>Any file type</span>
          · max {{ maxSizeMb }} MB
        </p>
      </div>
    </label>
  </div>
</template>
