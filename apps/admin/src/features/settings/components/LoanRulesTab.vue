<script setup lang="ts">
import { ref } from "vue";
import {
  AppTextInput,
  BaseButton,
  AppSwitch,
  AppSelect,
  AppDialog,
} from "@bcl/ui";
import type { LoanRuleConfig, CustomField } from "@bcl/types";
import { Plus, Trash2, ShieldCheck, Pencil } from "lucide-vue-next";

const props = defineProps<{
  modelValue: LoanRuleConfig;
}>();

const emit = defineEmits(["update:modelValue"]);

// Custom Field Management
const isAddFieldModalOpen = ref(false);
const editingFieldId = ref<string | null>(null);
const newField = ref<{
  label: string;
  type: CustomField["type"];
  required: boolean;
}>({
  label: "",
  type: "TEXT",
  required: true,
});

function openAddFieldModal() {
  editingFieldId.value = null;
  newField.value = { label: "", type: "TEXT", required: true };
  isAddFieldModalOpen.value = true;
}

function addCustomField() {
  if (!newField.value.label) return;

  const fields = [...(props.modelValue.customFields || [])];

  if (editingFieldId.value) {
    const index = fields.findIndex((f) => f.id === editingFieldId.value);
    if (index !== -1) {
      fields[index] = {
        ...fields[index],
        label: newField.value.label,
        type: newField.value.type,
        required: newField.value.required,
      };
    }
  } else {
    fields.push({
      id: "cf_" + Math.random().toString(36).substr(2, 6),
      label: newField.value.label,
      type: newField.value.type,
      required: newField.value.required,
    });
  }

  emit("update:modelValue", {
    ...props.modelValue,
    customFields: fields,
  });

  closeModal();
}

function editField(field: CustomField) {
  editingFieldId.value = field.id;
  newField.value = {
    label: field.label,
    type: field.type,
    required: field.required,
  };
  isAddFieldModalOpen.value = true;
}

function closeModal() {
  isAddFieldModalOpen.value = false;
  editingFieldId.value = null;
  newField.value = { label: "", type: "TEXT", required: true };
}

function removeField(id: string) {
  const fields = (props.modelValue.customFields || []).filter(
    (f) => f.id !== id,
  );
  emit("update:modelValue", {
    ...props.modelValue,
    customFields: fields,
  });
}

function saveRules() {
  // US-009: Log Eligibility Rule Changes
  console.log("Saving rules and logging audit event:", props.modelValue);
  // Implementation of Audit Trigger would go here
}
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-6 md:p-8"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100"
    >
      <div>
        <h2 class="text-lg font-bold text-slate-800 tracking-tight">
          Loan Underwriting Rules
        </h2>
        <p class="text-sm text-slate-500 mt-1">
          Configure eligibility parameters and enforce required KYC fields
          dynamically.
        </p>
      </div>
      <BaseButton variant="primary" @click="saveRules">Save Changes</BaseButton>
    </div>

    <div class="flex flex-col gap-8">
      <!-- Age Restrictions -->
      <div>
        <h3
          class="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider"
        >
          Age Eligibility Constraints
        </h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100"
        >
          <AppTextInput
            id="minAge"
            v-model.number="modelValue.minAge"
            label="Minimum Eligible Age"
            type="number"
          />
          <AppTextInput
            id="maxAge"
            v-model.number="modelValue.maxAge"
            label="Maximum Eligible Age"
            type="number"
          />
        </div>
      </div>

      <!-- Field Requirements -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Mandatory KYC Data Fields
          </h3>
          <BaseButton variant="ghost" size="sm" @click="openAddFieldModal">
            <Plus class="w-4 h-4 mr-1.5" /> Add Field
          </BaseButton>
        </div>

        <div class="flex flex-col gap-4">
          <!-- Static System Fields -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              v-for="(rule, key) in {
                requireBvn: 'Valid BVN Data',
                requireLocation: 'Geo-location Lock',
                requireVerifiedPhone: 'Verified Phone Source',
                requireGender: 'Declared Gender',
                requireDob: 'Birth Validation (DOB)',
                requireUtilityBill: 'Utility Bill Document',
                requireEmploymentProof: 'Proof of Job/Income',
              }"
              :key="key"
              class="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-primary-100 transition-colors cursor-pointer select-none"
            >
              <span class="text-sm font-medium text-slate-700">{{ rule }}</span>
              <AppSwitch
                v-model="
                  modelValue[
                    key as keyof Omit<
                      LoanRuleConfig,
                      'minAge' | 'maxAge' | 'customFields'
                    >
                  ]
                "
              />
            </label>
          </div>

          <!-- Dynamic Custom Fields -->
          <div v-if="modelValue.customFields?.length">
            <h3
              class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 mt-4"
            >
              Custom Data Fields
            </h3>
            <div class="mt-4 flex flex-col gap-3">
              <div
                v-for="field in modelValue.customFields"
                :key="field.id"
                class="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400"
                  >
                    <ShieldCheck class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-800">
                      {{ field.label }}
                    </p>
                    <p
                      class="text-[10px] text-slate-500 uppercase font-bold tracking-tight"
                    >
                      {{ field.type }} •
                      {{ field.required ? "Required" : "Optional" }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="editField(field)"
                    class="text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button
                    @click="removeField(field.id)"
                    class="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Field Modal -->
    <AppDialog
      v-model="isAddFieldModalOpen"
      :title="
        editingFieldId ? 'Edit Eligibility Field' : 'New Eligibility Field'
      "
      max-width="md"
    >
      <div class="flex flex-col gap-5 mt-2">
        <AppTextInput
          id="fieldLabel"
          v-model="newField.label"
          label="Field Label"
          placeholder="e.g. Spouse Name, Preferred Language"
        />

        <AppSelect
          id="fieldType"
          label="Data Type"
          v-model="newField.type"
          :options="[
            { label: 'Short Text', value: 'TEXT' },
            { label: 'Number', value: 'NUMBER' },
            { label: 'Boolean (Yes/No)', value: 'BOOLEAN' },
            { label: 'Date Pick', value: 'DATE' },
          ]"
        />

        <label
          class="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer select-none"
        >
          <div class="text-sm">
            <p class="font-bold text-slate-800">Mandatory Field</p>
            <p class="text-xs text-slate-500">
              User cannot skip this during onboarding.
            </p>
          </div>
          <AppSwitch v-model="newField.required" />
        </label>

        <div class="flex justify-end gap-3 mt-4">
          <BaseButton variant="ghost" @click="closeModal">Cancel</BaseButton>
          <BaseButton variant="primary" @click="addCustomField">
            {{ editingFieldId ? "Save Changes" : "Add Field" }}
          </BaseButton>
        </div>
      </div>
    </AppDialog>
  </div>
</template>
