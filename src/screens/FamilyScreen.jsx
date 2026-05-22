import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Modal, TextInput, StyleSheet, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import * as familyApi from '../api/family';
import { COLORS } from '../constants/colors';

const ROLE_COLORS = {
  owner:  { bg: '#EEF2FF', text: COLORS.primary },
  admin:  { bg: '#FEF3C7', text: '#D97706' },
  member: { bg: COLORS.background, text: COLORS.textLight },
};

export default function FamilyScreen() {
  const { user, family } = useAuthStore((s) => ({ user: s.user, family: s.family }));
  const [members,  setMembers]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [modal,    setModal]    = useState(false);
  const [email,    setEmail]    = useState('');
  const [role,     setRole]     = useState('member');
  const [sending,  setSending]  = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data } = await familyApi.getMembers();
      setMembers(data.data ?? data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMembers(); }, []);

  const handleInvite = async () => {
    if (!email) return Alert.alert('Error', 'Ingresa un correo');
    setSending(true);
    try {
      await familyApi.inviteMember({ email, role });
      setModal(false);
      setEmail('');
      loadMembers();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'Error al invitar');
    } finally {
      setSending(false);
    }
  };

  const confirmRemove = (m) => Alert.alert('Eliminar', `¿Eliminar a ${m.name} de la familia?`, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Eliminar', style: 'destructive', onPress: async () => {
      await familyApi.removeMember(m.id);
      loadMembers();
    }},
  ]);

  const isOwnerOrAdmin = members.some((m) => m.id === user?.id && ['owner','admin'].includes(m.pivot?.role));

  const renderItem = ({ item }) => {
    const rc = ROLE_COLORS[item.pivot?.role] ?? ROLE_COLORS.member;
    return (
      <View style={s.item}>
        <View style={s.itemLeft}>
          <Text style={s.itemName}>{item.name}</Text>
          <Text style={s.itemEmail}>{item.email}</Text>
        </View>
        <View style={s.itemRight}>
          <View style={[s.badge, { backgroundColor: rc.bg }]}>
            <Text style={[s.badgeText, { color: rc.text }]}>{item.pivot?.role}</Text>
          </View>
          {isOwnerOrAdmin && item.id !== user?.id && (
            <TouchableOpacity onPress={() => confirmRemove(item)}>
              <Text style={s.removeBtn}>Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={s.screen}>
      <View style={s.headerRow}>
        <View>
          <Text style={s.title}>Familia</Text>
          {family && <Text style={s.familyName}>{family.name}</Text>}
        </View>
        {isOwnerOrAdmin && (
          <TouchableOpacity style={s.addBtn} onPress={() => setModal(true)}>
            <Text style={s.addBtnText}>+ Invitar</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={members}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMembers} />}
        ListEmptyComponent={<Text style={s.empty}>Sin miembros</Text>}
        ItemSeparatorComponent={() => <View style={s.divider} />}
      />

      <Modal visible={modal} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Invitar miembro</Text>
            <TextInput
              style={s.input}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <View style={s.roleRow}>
              {['member','admin'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[s.roleBtn, role === r && s.roleBtnActive]}
                  onPress={() => setRole(r)}
                >
                  <Text style={[s.roleBtnText, role === r && s.roleBtnTextActive]}>
                    {r === 'member' ? 'Miembro' : 'Administrador'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={s.actions}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setModal(false)}>
                <Text style={s.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={handleInvite} disabled={sending}>
                {sending ? <ActivityIndicator color={COLORS.white} /> : <Text style={s.saveBtnText}>Invitar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen:        { flex: 1, backgroundColor: COLORS.background },
  headerRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, paddingBottom: 12 },
  title:         { fontSize: 20, fontWeight: '700', color: COLORS.text },
  familyName:    { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  addBtn:        { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText:    { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  list:          { paddingHorizontal: 16, paddingBottom: 24 },
  item:          { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemLeft:      { flex: 1 },
  itemName:      { fontSize: 15, fontWeight: '500', color: COLORS.text },
  itemEmail:     { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  itemRight:     { alignItems: 'flex-end', gap: 6 },
  badge:         { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText:     { fontSize: 11, fontWeight: '600' },
  removeBtn:     { fontSize: 11, color: COLORS.danger },
  divider:       { height: 8 },
  empty:         { textAlign: 'center', marginTop: 60, color: COLORS.textLight },
  overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet:         { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36 },
  sheetTitle:    { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  input:         { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 14, fontSize: 14, color: COLORS.text },
  roleRow:       { flexDirection: 'row', gap: 10, marginBottom: 18 },
  roleBtn:       { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  roleBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  roleBtnText:   { fontSize: 13, color: COLORS.textLight },
  roleBtnTextActive: { color: COLORS.white, fontWeight: '600' },
  actions:       { flexDirection: 'row', gap: 12 },
  cancelBtn:     { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  cancelText:    { fontSize: 14, color: COLORS.textLight },
  saveBtn:       { flex: 1, backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  saveBtnText:   { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});
