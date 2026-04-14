<script setup lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2,
  Undo,
  Redo,
  Quote
} from "lucide-vue-next";
import { watch } from "vue";

interface Props {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: [
        "prose prose-sm sm:prose-base max-w-none focus:outline-none",
        "min-h-[150px] p-4 text-slate-700 leading-relaxed",
      ].join(" "),
    },
  },
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
  onBlur: ({ event }) => {
    emit("blur", event);
  },
  onFocus: ({ event }) => {
    emit("focus", event);
  },
});

// Sync with external modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue, false);
  }
});
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      :class="[
        'text-sm font-medium leading-none',
        error ? 'text-red-600' : 'text-slate-700',
        disabled && 'opacity-50 cursor-not-allowed',
      ]"
    >
      {{ label }}
      <span v-if="required" class="ml-0.5 text-red-500" aria-hidden="true">*</span>
    </label>

    <!-- Editor Container -->
    <div
      :class="[
        'rounded-xl border bg-white overflow-hidden transition-all duration-200',
        !error ? 'border-slate-200 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary-100' : 'border-red-400 focus-within:ring-3 focus-within:ring-red-100',
        disabled && 'opacity-60 bg-slate-50 cursor-not-allowed',
      ]"
    >
      <!-- Toolbar -->
      <div v-if="editor" class="flex flex-wrap items-center gap-1 p-1.5 border-b border-slate-100 bg-slate-50/50">
        <button
          type="button"
          @click="editor.chain().focus().toggleBold().run()"
          :class="['p-1.5 rounded-lg transition-colors', editor.isActive('bold') ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200']"
          title="Bold"
        >
          <Bold class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleItalic().run()"
          :class="['p-1.5 rounded-lg transition-colors', editor.isActive('italic') ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200']"
          title="Italic"
        >
          <Italic class="w-4 h-4" />
        </button>
        
        <div class="w-px h-6 bg-slate-200 mx-1"></div>

        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="['p-1.5 rounded-lg transition-colors', editor.isActive('heading', { level: 1 }) ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200']"
          title="Heading 1"
        >
          <Heading1 class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="['p-1.5 rounded-lg transition-colors', editor.isActive('heading', { level: 2 }) ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200']"
          title="Heading 2"
        >
          <Heading2 class="w-4 h-4" />
        </button>

        <div class="w-px h-6 bg-slate-200 mx-1"></div>

        <button
          type="button"
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="['p-1.5 rounded-lg transition-colors', editor.isActive('bulletList') ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200']"
          title="Bullet List"
        >
          <List class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="['p-1.5 rounded-lg transition-colors', editor.isActive('orderedList') ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200']"
          title="Ordered List"
        >
          <ListOrdered class="w-4 h-4" />
        </button>
        <button
          type="button"
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="['p-1.5 rounded-lg transition-colors', editor.isActive('blockquote') ? 'bg-primary-100 text-primary-700' : 'text-slate-600 hover:bg-slate-200']"
          title="Quote"
        >
          <Quote class="w-4 h-4" />
        </button>

        <div class="ml-auto flex items-center gap-1">
          <button
            type="button"
            @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().undo()"
            class="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-30"
            title="Undo"
          >
            <Undo class="w-4 h-4" />
          </button>
          <button
            type="button"
            @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().redo()"
            class="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-30"
            title="Redo"
          >
            <Redo class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Editor Content -->
      <editor-content :editor="editor" />
    </div>

    <!-- Error message -->
    <p v-if="error" class="flex items-center gap-1 text-xs text-red-600">
      <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 4a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0V5Zm.75 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
      </svg>
      {{ error }}
    </p>

    <!-- Hint text -->
    <p v-else-if="hint" class="text-xs text-slate-500">{{ hint }}</p>
  </div>
</template>

<style>
/* Tiptap Editor Styling */
.ProseMirror {
  outline: none !important;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.ProseMirror h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.ProseMirror h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.ProseMirror ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.ProseMirror ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.ProseMirror blockquote {
  border-left: 3px solid #e2e8f0;
  padding-left: 1rem;
  font-style: italic;
  color: #64748b;
  margin-bottom: 0.5rem;
}
</style>
