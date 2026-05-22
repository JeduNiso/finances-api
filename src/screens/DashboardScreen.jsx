import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useDashboardStore } from '../stores/dashboardStore';
import { useAuthStore }      from '../stores/authStore';
import { COLORS } from '../constants/colors';

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n ?? 0);

export default function DashboardScreen() {
  const { data, isLoading, fetch } = useDashboardStore();
  const { user, family, logout }   = useAuthStore((s) => ({ user: s.user, family: s.family, logout: s.logout }));

  useEffect(() => { fetch(); }, []);

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetch} />}
    >
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Hola, {user?.name?.split(' ')[0]} 👋</Text>
          <Text style={s.familyName}>{family?.name}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={s.logoutBtn}>
          <Text style={s.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Balance card */}
      <View style={s.balanceCard}>
        <Text style={s.balanceLabel}>Balance total</Text>
        <Text style={s.balanceAmount}>{fmt(data?.total_balance)}</Text>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={[s.statBox, { borderColor: COLORS.success }]}>
          <Text style={s.statValue}>{data?.expenses?.paid ?? 0}</Text>
          <Text style={s.statLabel}>Fijos pagados</Text>
        </View>
        <View style={[s.statBox, { borderColor: COLORS.warning }]}>
          <Text style={s.statValue}>{data?.expenses?.pending ?? 0}</Text>
          <Text style={s.statLabel}>Pendientes</Text>
        </View>
        <View style={[s.statBox, { borderColor: COLORS.danger }]}>
          <Text style={s.statValue}>{data?.active_debts?.length ?? 0}</Text>
          <Text style={s.statLabel}>Deudas activas</Text>
        </View>
      </View>

      {/* Top 5 gastos */}
      {data?.top5_spending?.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Top 5 gastos</Text>
          {data.top5_spending.map((sp) => (
            <View key={sp.id} style={s.row}>
              <Text style={s.rowLabel}>{sp.description ?? sp.category?.name}</Text>
              <Text style={s.rowAmount}>{fmt(sp.amount)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Gastos por categoría */}
      {data?.spending_by_category?.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Por categoría</Text>
          {data.spending_by_category.map((c) => (
            <View key={c.category_id} style={s.row}>
              <Text style={s.rowLabel}>{c.name}</Text>
              <Text style={s.rowAmount}>{fmt(c.total)}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: COLORS.background },
  content:       { padding: 20, paddingBottom: 40 },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting:      { fontSize: 20, fontWeight: '700', color: COLORS.text },
  familyName:    { fontSize: 13, color: COLORS.textLight },
  logoutBtn:     { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  logoutText:    { fontSize: 13, color: COLORS.textLight },
  balanceCard:   { backgroundColor: COLORS.primary, borderRadius: 16, padding: 24, marginBottom: 16, alignItems: 'center' },
  balanceLabel:  { color: '#C7D2FE', fontSize: 13, marginBottom: 6 },
  balanceAmount: { color: COLORS.white, fontSize: 32, fontWeight: '800' },
  statsRow:      { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statBox:       { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1.5 },
  statValue:     { fontSize: 22, fontWeight: '700', color: COLORS.text },
  statLabel:     { fontSize: 11, color: COLORS.textLight, textAlign: 'center', marginTop: 2 },
  section:       { backgroundColor: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle:  { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  row:           { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowLabel:      { fontSize: 14, color: COLORS.text, flex: 1 },
  rowAmount:     { fontSize: 14, fontWeight: '600', color: COLORS.text },
});
