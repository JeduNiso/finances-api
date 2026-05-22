import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal,
  TextInput, StyleSheet, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useSpendingStore } from '../stores/spendingStore';
import { COLORS } from '../constants/colors';
import { getAccounts } from '../api/accounts';
import { Picker } from '@react-native-picker/picker';

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n ?? 0);

export default function SpendingScreen() {
  const { items, isLoading, fetch, create, remove } = useSpendingStore();
  const [accounts, setAccounts] = useState([]);
  const [modal,    setModal]    = useState(false);
  const [form,     setForm]     = useState({ amount: '', description: '', spent_at: new Date().toISOString().slice(0,10), account_id: '' });
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    fetch();
    getAccounts().then(({ data }) => setAccounts(data.data ?? data));
  }, []);

  const handleCreate = async () => {
    if (!form.amount || !form.account_id) return Alert.alert('Error', 'Completa todos los campos');
    setSaving(true);
    try {
      await create(form);
      setModal(false);
      setForm({ amount: '', description: '', spent_at: new Date().toISOString().slice(0,10), account_id: '' });
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id) => Alert.alert('Eliminar', '¿Eliminar este gasto?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Eliminar', style: 'destructive', onPress: () => remove(id) },
  ]);

  const renderItem = ({ item }) => (
    <View style={s.item}>
      <View style={s.itemLeft}>
        <Text style={s.itemDesc}>{item.description ?? item.category?.name ?? '—'}</Text>
        <Text style={s.itemDate}>{item.spent_at}</Text>
      </View>
      <View style={s.itemRight}>
        <Text style={s.itemAmount}>{fmt(item.amount)}</Text>
        <TouchableOpacity onPress={() => confirmDelete(item.id)}>
          <Text style={s.deleteBtn}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={s.screen}>
      <View style={s.headerRow}>
        <Text style={s.title}>Gastos</Text>
        <TouchableOpacity style={s.addBtn} onPress={() => setModal(true)}>
          <Text style={s.addBtnText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetch} />}
        ListEmptyComponent={<Text style={s.empty}>Sin gastos registrados</Text>}
        ItemSeparatorComponent={() => <View style={s.divider} />}
      />

      <Modal visible={modal} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Nuevo gasto</Text>
            <TextInput
              style={s.input}
              placeholder="Monto"
              keyboardType="decimal-pad"
              value={form.amount}
              onChangeText={(v) => setForm({ ...form, amount: v })}
            />
            <TextInput
              style={s.input}
              placeholder="Descripción (opcional)"
              value={form.description}
              onChangeText={(v) => setForm({ ...form, description: v })}
            />
            <TextInput
              style={s.input}
              placeholder="Fecha (YYYY-MM-DD)"
              value={form.spent_at}
              onChangeText={(v) => setForm({ ...form, spent_at: v })}
            />
            <Picker
              selectedValue={form.account_id}
              onValueChange={(v) => setForm({ ...form, account_id: v })}
              style={s.picker}
            >
              <Picker.Item label="Seleccionar cuenta" value="" />
              {accounts.map((a) => <Picker.Item key={a.id} label={a.account_number} value={String(a.id)} />)}
            </Picker>
            <View style={s.sheetActions}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setModal(false)}>
                <Text style={s.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={handleCreate} disabled={saving}>
                {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={s.saveBtnText}>Guardar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: COLORS.background },
  headerRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
  title:       { fontSize: 20, fontWeight: '700', color: COLORS.text },
  addBtn:      { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText:  { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  list:        { paddingHorizontal: 16, paddingBottom: 24 },
  item:        { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemLeft:    { flex: 1 },
  itemDesc:    { fontSize: 15, fontWeight: '500', color: COLORS.text },
  itemDate:    { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  itemRight:   { alignItems: 'flex-end' },
  itemAmount:  { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  deleteBtn:   { fontSize: 11, color: COLORS.danger, marginTop: 4 },
  divider:     { height: 8 },
  empty:       { textAlign: 'center', marginTop: 60, color: COLORS.textLight },
  overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet:       { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36 },
  sheetTitle:  { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  input:       { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12, fontSize: 14, color: COLORS.text },
  picker:      { marginBottom: 12 },
  sheetActions:{ flexDirection: 'row', gap: 12 },
  cancelBtn:   { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  cancelText:  { fontSize: 14, color: COLORS.textLight },
  saveBtn:     { flex: 1, backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  saveBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});
