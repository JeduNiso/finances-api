import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal,
  TextInput, StyleSheet, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useDebtsStore } from '../stores/debtsStore';
import { COLORS } from '../constants/colors';
import { getAccounts } from '../api/accounts';
import { Picker } from '@react-native-picker/picker';

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n ?? 0);

export default function DebtScreen() {
  const { items, summary, isLoading, fetch, fetchSummary, addPayment } = useDebtsStore();
  const [accounts, setAccounts] = useState([]);
  const [payTarget, setPayTarget] = useState(null);
  const [payForm,   setPayForm]   = useState({ amount: '', paid_at: new Date().toISOString().slice(0,10), account_id: '', notes: '' });
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    fetch();
    fetchSummary();
    getAccounts().then(({ data }) => setAccounts(data.data ?? data));
  }, []);

  const handlePayment = async () => {
    if (!payForm.amount || !payForm.account_id) return Alert.alert('Error', 'Completa todos los campos');
    setSaving(true);
    try {
      await addPayment(payTarget.id, payForm);
      setPayTarget(null);
      fetch();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'Error');
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item }) => {
    const progress = item.progress_percentage ?? 0;
    return (
      <View style={s.card}>
        <View style={s.cardHeader}>
          <Text style={s.creditor}>{item.creditor}</Text>
          <View style={[s.badge, item.status === 'paid' ? s.badgePaid : s.badgeActive]}>
            <Text style={s.badgeText}>{item.status === 'paid' ? 'Pagado' : 'Activo'}</Text>
          </View>
        </View>
        <Text style={s.balanceText}>{fmt(item.current_balance)} restante</Text>
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
        </View>
        <Text style={s.progressPct}>{Math.round(progress)}% pagado</Text>
        {item.status !== 'paid' && (
          <TouchableOpacity
            style={s.abonarBtn}
            onPress={() => { setPayTarget(item); setPayForm({ amount: String(item.monthly_payment ?? ''), paid_at: new Date().toISOString().slice(0,10), account_id: '', notes: '' }); }}
          >
            <Text style={s.abonarText}>Abonar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={s.screen}>
      <Text style={s.title}>Deudas</Text>

      {summary && (
        <View style={s.summaryRow}>
          <View style={s.summaryBox}>
            <Text style={s.summaryLabel}>Total adeudado</Text>
            <Text style={[s.summaryValue, { color: COLORS.danger }]}>{fmt(summary.total_owed)}</Text>
          </View>
          <View style={s.summaryBox}>
            <Text style={s.summaryLabel}>Pagado este mes</Text>
            <Text style={[s.summaryValue, { color: COLORS.success }]}>{fmt(summary.paid_this_month)}</Text>
          </View>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => { fetch(); fetchSummary(); }} />}
        ListEmptyComponent={<Text style={s.empty}>Sin deudas</Text>}
      />

      <Modal visible={!!payTarget} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Abonar a {payTarget?.creditor}</Text>
            <TextInput style={s.input} placeholder="Monto" keyboardType="decimal-pad" value={payForm.amount} onChangeText={(v) => setPayForm({ ...payForm, amount: v })} />
            <TextInput style={s.input} placeholder="Fecha (YYYY-MM-DD)" value={payForm.paid_at} onChangeText={(v) => setPayForm({ ...payForm, paid_at: v })} />
            <Picker selectedValue={payForm.account_id} onValueChange={(v) => setPayForm({ ...payForm, account_id: v })} style={s.picker}>
              <Picker.Item label="Seleccionar cuenta" value="" />
              {accounts.map((a) => <Picker.Item key={a.id} label={a.account_number} value={String(a.id)} />)}
            </Picker>
            <TextInput style={s.input} placeholder="Notas (opcional)" value={payForm.notes} onChangeText={(v) => setPayForm({ ...payForm, notes: v })} />
            <View style={s.actions}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setPayTarget(null)}><Text style={s.cancelText}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={handlePayment} disabled={saving}>
                {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={s.saveBtnText}>Confirmar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: COLORS.background },
  title:        { fontSize: 20, fontWeight: '700', color: COLORS.text, padding: 20, paddingBottom: 8 },
  summaryRow:   { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 12 },
  summaryBox:   { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  summaryLabel: { fontSize: 11, color: COLORS.textLight },
  summaryValue: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  list:         { paddingHorizontal: 16, paddingBottom: 24 },
  card:         { backgroundColor: COLORS.card, borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  cardHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  creditor:     { fontSize: 16, fontWeight: '600', color: COLORS.text },
  badge:        { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeActive:  { backgroundColor: '#EEF2FF' },
  badgePaid:    { backgroundColor: '#D1FAE5' },
  badgeText:    { fontSize: 11, fontWeight: '600' },
  balanceText:  { fontSize: 14, color: COLORS.textLight, marginBottom: 10 },
  progressBar:  { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: 8, backgroundColor: COLORS.primary, borderRadius: 4 },
  progressPct:  { fontSize: 11, color: COLORS.textLight, marginBottom: 10 },
  abonarBtn:    { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 9, alignItems: 'center' },
  abonarText:   { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  empty:        { textAlign: 'center', marginTop: 60, color: COLORS.textLight },
  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet:        { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36 },
  sheetTitle:   { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  input:        { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12, fontSize: 14, color: COLORS.text },
  picker:       { marginBottom: 12 },
  actions:      { flexDirection: 'row', gap: 12 },
  cancelBtn:    { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  cancelText:   { fontSize: 14, color: COLORS.textLight },
  saveBtn:      { flex: 1, backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  saveBtnText:  { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});
