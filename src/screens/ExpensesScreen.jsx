import React, { useEffect, useState } from 'react';
import {
  View, Text, SectionList, TouchableOpacity, Modal,
  TextInput, StyleSheet, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useExpensesStore } from '../stores/expensesStore';
import { COLORS } from '../constants/colors';
import { getAccounts } from '../api/accounts';
import { Picker } from '@react-native-picker/picker';

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n ?? 0);

export default function ExpensesScreen() {
  const { calendar, isLoading, fetchCalendar, pay } = useExpensesStore();
  const [accounts, setAccounts] = useState([]);
  const [payTarget, setPayTarget] = useState(null);
  const [payForm,   setPayForm]   = useState({ amount_paid: '', paid_at: new Date().toISOString().slice(0,10), account_id: '', notes: '' });
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    fetchCalendar();
    getAccounts().then(({ data }) => setAccounts(data.data ?? data));
  }, []);

  const handlePay = async () => {
    if (!payForm.amount_paid || !payForm.account_id) return Alert.alert('Error', 'Completa todos los campos');
    setSaving(true);
    try {
      await pay(payTarget.id, payForm);
      setPayTarget(null);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'Error al pagar');
    } finally {
      setSaving(false);
    }
  };

  const pending = calendar.filter((e) => !e.paid);
  const paid    = calendar.filter((e) => e.paid);
  const sections = [
    pending.length ? { title: 'Pendientes', data: pending } : null,
    paid.length    ? { title: 'Pagados',    data: paid    } : null,
  ].filter(Boolean);

  const renderItem = ({ item, section }) => (
    <View style={[s.item, section.title === 'Pagados' && s.itemPaid]}>
      <View style={s.itemLeft}>
        <Text style={s.itemName}>{item.name}</Text>
        <Text style={s.itemMeta}>Día {item.day_of_month} · {item.frequency}</Text>
      </View>
      <View style={s.itemRight}>
        <Text style={s.itemAmount}>{fmt(item.amount)}</Text>
        {!item.paid && (
          <TouchableOpacity
            style={s.payBtn}
            onPress={() => { setPayTarget(item); setPayForm({ amount_paid: String(item.amount), paid_at: new Date().toISOString().slice(0,10), account_id: '', notes: '' }); }}
          >
            <Text style={s.payBtnText}>Pagar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={s.screen}>
      <Text style={s.title}>Gastos Fijos</Text>
      <SectionList
        sections={sections}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => <Text style={s.sectionHeader}>{section.title}</Text>}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchCalendar} />}
        ListEmptyComponent={<Text style={s.empty}>Sin gastos fijos</Text>}
        stickySectionHeadersEnabled={false}
      />

      <Modal visible={!!payTarget} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Pagar: {payTarget?.name}</Text>
            <TextInput style={s.input} placeholder="Monto pagado" keyboardType="decimal-pad" value={payForm.amount_paid} onChangeText={(v) => setPayForm({ ...payForm, amount_paid: v })} />
            <TextInput style={s.input} placeholder="Fecha (YYYY-MM-DD)" value={payForm.paid_at} onChangeText={(v) => setPayForm({ ...payForm, paid_at: v })} />
            <Picker selectedValue={payForm.account_id} onValueChange={(v) => setPayForm({ ...payForm, account_id: v })} style={s.picker}>
              <Picker.Item label="Seleccionar cuenta" value="" />
              {accounts.map((a) => <Picker.Item key={a.id} label={a.account_number} value={String(a.id)} />)}
            </Picker>
            <TextInput style={s.input} placeholder="Notas (opcional)" value={payForm.notes} onChangeText={(v) => setPayForm({ ...payForm, notes: v })} />
            <View style={s.actions}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setPayTarget(null)}><Text style={s.cancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={handlePay} disabled={saving}>
                {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={s.saveBtnText}>Confirmar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export { useExpensesStore };

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: COLORS.background },
  title:         { fontSize: 20, fontWeight: '700', color: COLORS.text, padding: 20, paddingBottom: 8 },
  list:          { paddingHorizontal: 16, paddingBottom: 24 },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: COLORS.textLight, marginTop: 16, marginBottom: 8, textTransform: 'uppercase' },
  item:          { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  itemPaid:      { opacity: 0.6 },
  itemLeft:      { flex: 1 },
  itemName:      { fontSize: 15, fontWeight: '500', color: COLORS.text },
  itemMeta:      { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  itemRight:     { alignItems: 'flex-end' },
  itemAmount:    { fontSize: 16, fontWeight: '700', color: COLORS.text },
  payBtn:        { backgroundColor: COLORS.primary, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5, marginTop: 4 },
  payBtnText:    { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  empty:         { textAlign: 'center', marginTop: 60, color: COLORS.textLight },
  overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet:         { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36 },
  sheetTitle:    { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  input:         { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12, fontSize: 14, color: COLORS.text },
  picker:        { marginBottom: 12 },
  actions:       { flexDirection: 'row', gap: 12 },
  cancelBtn:     { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  cancelText:    { fontSize: 14, color: COLORS.textLight },
  saveBtn:       { flex: 1, backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  saveBtnText:   { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});
