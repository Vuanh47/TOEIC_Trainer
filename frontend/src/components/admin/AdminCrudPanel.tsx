import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, spacing } from "@/src/assets/styles/theme";

export type FormValue = string | boolean;
export type FormValues = Record<string, FormValue>;

export type SelectOption = {
  label: string;
  value: string;
};

export type AdminField = {
  label: string;
  name: string;
  options?: SelectOption[];
  placeholder?: string;
  required?: boolean;
  type: "text" | "number" | "textarea" | "select" | "switch";
};

export type AdminColumn<T> = {
  label: string;
  render: (item: T) => string;
};

type AdminCrudPanelProps<T> = {
  columns: AdminColumn<T>[];
  emptyText?: string;
  fields: AdminField[];
  getInitialValues: (item?: T) => FormValues;
  getItemId: (item: T) => number;
  loading?: boolean;
  onCreate?: (values: FormValues) => Promise<void>;
  onDelete?: (item: T) => Promise<void>;
  onRefresh?: () => void;
  onUpdate?: (item: T, values: FormValues) => Promise<void>;
  records: T[];
  subtitle?: string;
  title: string;
  working?: boolean;
};

export default function AdminCrudPanel<T>({
  columns,
  emptyText = "Chua co du lieu.",
  fields,
  getInitialValues,
  getItemId,
  loading = false,
  onCreate,
  onDelete,
  onRefresh,
  onUpdate,
  records,
  subtitle,
  title,
  working = false,
}: AdminCrudPanelProps<T>) {
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [values, setValues] = useState<FormValues>(() => getInitialValues());
  const [activeSelect, setActiveSelect] = useState<string | null>(null);

  const openCreate = () => {
    setEditingItem(null);
    setValues(getInitialValues());
    setActiveSelect(null);
    setFormOpen(true);
  };

  const openEdit = (item: T) => {
    setEditingItem(item);
    setValues(getInitialValues(item));
    setFormOpen(true);
  };

  const updateValue = (name: string, value: FormValue) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const closeForm = () => {
    setEditingItem(null);
    setActiveSelect(null);
    setFormOpen(false);
  };

  const submitForm = async () => {
    if (editingItem && onUpdate) {
      await onUpdate(editingItem, values);
      closeForm();
      return;
    }

    if (onCreate) {
      await onCreate(values);
      closeForm();
    }
  };

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.headerActions}>
          {onRefresh ? (
            <Pressable
              disabled={working}
              onPress={onRefresh}
              style={styles.iconButton}
            >
              <Ionicons
                color={colors.textMuted}
                name="refresh-outline"
                size={18}
              />
            </Pressable>
          ) : null}
          {onCreate ? (
            <Pressable
              disabled={working}
              onPress={openCreate}
              style={[styles.actionButton, styles.primaryButton]}
            >
              <Ionicons color={colors.surface} name="add" size={18} />
              <Text style={styles.primaryButtonText}>Them moi</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={closeForm}
        transparent
        visible={formOpen}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.formHeader}>
              <View>
                <Text style={styles.formTitle}>
                  {editingItem ? "Cap nhat ban ghi" : "Tao ban ghi moi"}
                </Text>
                <Text style={styles.formSubtitle}>
                  Nhap dung payload request backend dang yeu cau.
                </Text>
              </View>
              <Pressable onPress={closeForm} style={styles.iconButton}>
                <Ionicons color={colors.textMuted} name="close" size={18} />
              </Pressable>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGrid}>
                {fields.map((field) => (
                  <View
                    key={field.name}
                    style={[
                      styles.field,
                      field.type === "textarea" ? styles.fieldWide : null,
                    ]}
                  >
                    <Text style={styles.label}>
                      {field.label}
                      {field.required ? (
                        <Text style={styles.required}> *</Text>
                      ) : null}
                    </Text>
                    {field.type === "switch" ? (
                      <View style={styles.switchRow}>
                        <Switch
                          onValueChange={(value) =>
                            updateValue(field.name, value)
                          }
                          value={Boolean(values[field.name])}
                        />
                        <Text style={styles.switchText}>
                          {Boolean(values[field.name]) ? "Bat" : "Tat"}
                        </Text>
                      </View>
                    ) : null}
                    {field.type === "select" ? (
                      <View style={styles.selectDropdownWrapper}>
                        <View style={styles.selectField}>
                          <Text
                            style={styles.selectTextValue}
                            numberOfLines={1}
                          >
                            {field.options?.find(
                              (option) =>
                                String(values[field.name]) === option.value,
                            )?.label ?? "Chon..."}
                          </Text>
                        </View>
                        <View style={styles.selectDropdownAlwaysVisible}>
                          <ScrollView showsVerticalScrollIndicator={false}>
                            {(field.options ?? []).map((option) => (
                              <Pressable
                                key={option.value}
                                onPress={() =>
                                  updateValue(field.name, option.value)
                                }
                                style={styles.selectDropdownOption}
                              >
                                <Text style={styles.selectText}>
                                  {option.label}
                                </Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                        </View>
                      </View>
                    ) : null}
                    {field.type !== "switch" && field.type !== "select" ? (
                      <TextInput
                        keyboardType={
                          field.type === "number" ? "numeric" : "default"
                        }
                        multiline={field.type === "textarea"}
                        onChangeText={(value) => updateValue(field.name, value)}
                        placeholder={field.placeholder}
                        placeholderTextColor={colors.textMuted}
                        style={[
                          styles.input,
                          field.type === "textarea" ? styles.textarea : null,
                        ]}
                        value={String(values[field.name] ?? "")}
                      />
                    ) : null}
                  </View>
                ))}
              </View>
            </ScrollView>
            <View style={styles.formActions}>
              <Pressable
                disabled={working}
                onPress={closeForm}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Huy</Text>
              </Pressable>
              <Pressable
                disabled={working}
                onPress={submitForm}
                style={[styles.actionButton, styles.primaryButton]}
              >
                <Ionicons
                  color={colors.surface}
                  name="save-outline"
                  size={18}
                />
                <Text style={styles.primaryButtonText}>
                  {working ? "Dang luu..." : "Luu"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView horizontal style={styles.tableScroller}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {columns.map((column) => (
              <Text key={column.label} style={styles.headerCell}>
                {column.label}
              </Text>
            ))}
            <Text style={[styles.headerCell, styles.actionCell]}>Actions</Text>
          </View>
          {records.map((item) => (
            <View key={getItemId(item)} style={styles.tableRow}>
              {columns.map((column) => (
                <Text key={column.label} numberOfLines={2} style={styles.cell}>
                  {column.render(item)}
                </Text>
              ))}
              <View style={[styles.rowActions, styles.actionCell]}>
                {onUpdate ? (
                  <Pressable disabled={working} onPress={() => openEdit(item)}>
                    <Ionicons
                      color={colors.textMuted}
                      name="create-outline"
                      size={18}
                    />
                  </Pressable>
                ) : null}
                {onDelete ? (
                  <Pressable disabled={working} onPress={() => onDelete(item)}>
                    <Ionicons
                      color={colors.danger}
                      name="trash-outline"
                      size={18}
                    />
                  </Pressable>
                ) : null}
              </View>
            </View>
          ))}
          {!loading && records.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
          ) : null}
          {loading ? (
            <View style={styles.tableRow}>
              <Text style={styles.emptyText}>Dang tai du lieu...</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 8,
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  actionCell: {
    maxWidth: 104,
    minWidth: 104,
  },
  cell: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
    minWidth: 148,
    paddingRight: spacing.md,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  field: {
    flex: 1,
    minWidth: 220,
  },
  fieldWide: {
    flexBasis: "100%",
  },
  formActions: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "flex-end",
    marginTop: spacing.md,
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  formHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  formTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  formSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 3,
  },
  formWrap: {
    backgroundColor: "#0E1728",
    borderColor: "#2A3A55",
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 1,
    shadowRadius: 30,
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(3,7,18,0.72)",
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },
  modalCard: {
    backgroundColor: "#0E1728",
    borderColor: "#3A4A63",
    borderRadius: 18,
    borderWidth: 1,
    maxHeight: "88%",
    maxWidth: 1120,
    padding: 22,
    shadowColor: "rgba(0,0,0,0.62)",
    shadowOffset: { width: 0, height: 28 },
    shadowOpacity: 1,
    shadowRadius: 50,
    width: "92%",
  },
  modalBody: {
    maxHeight: 560,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  headerCell: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    minWidth: 148,
    paddingRight: spacing.md,
    textTransform: "uppercase",
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#152238",
    borderColor: "#30425F",
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  input: {
    backgroundColor: "#0A1220",
    borderColor: "#344765",
    borderRadius: 10,
    borderWidth: 1,
    color: colors.text,
    fontSize: 14,
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },
  panel: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#2F6EA8",
    shadowColor: "#2F6EA8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.34,
    shadowRadius: 22,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: "800",
  },
  required: {
    color: colors.danger,
  },
  rowActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#152238",
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  selectDropdownWrapper: {
    width: "100%",
    position: "relative",
    zIndex: 100,
  },
  selectField: {
    alignItems: "center",
    backgroundColor: "#0A1220",
    borderColor: "#344765",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 42,
    paddingHorizontal: 12,
  },
  selectTextValue: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  selectDropdown: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#0A1228",
    borderColor: "#344765",
    borderRadius: 10,
    borderWidth: 1,
    maxHeight: 220,
    overflow: "hidden",
  },
  selectDropdownAlwaysVisible: {
    backgroundColor: "#0A1228",
    borderColor: "#344765",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
    maxHeight: 220,
    overflow: "hidden",
  },
  selectDropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomColor: "#344765",
    borderBottomWidth: 1,
  },
  selectActive: {
    backgroundColor: "#244D7F",
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  selectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectOption: {
    backgroundColor: "#0A1220",
    borderColor: "#344765",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  selectText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  selectTextActive: {
    color: colors.text,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  switchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 40,
  },
  switchText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  table: {
    minWidth: "100%",
  },
  tableHeader: {
    backgroundColor: "#152238",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  tableRow: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  tableScroller: {
    backgroundColor: "#0E1728",
    borderColor: "#2A3A55",
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 22,
  },
  textarea: {
    minHeight: 74,
    textAlignVertical: "top",
  },
  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "900",
  },
});
