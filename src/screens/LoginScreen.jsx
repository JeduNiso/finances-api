import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { COLORS } from '../constants/colors';

export default function LoginScreen({ navigation }) {
  const login = useAuthStore((s) => s.login);
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) return Alert.alert('Error', 'Completa todos los campos');
    setLoading(true);
    try {
      await login(form);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message ?? 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.container}>
      <View style={s.card}>
        <Text style={s.title}>Finances</Text>
        <Text style={s.subtitle}>Inicia sesión</Text>

        <TextInput
          style={s.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
        />
        <TextInput
          style={s.input}
          placeholder="Contraseña"
          secureTextEntry
          value={form.password}
          onChangeText={(v) => setForm({ ...form, password: v })}
        />

        <TouchableOpacity style={s.btn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={s.btnText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={s.link}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', padding: 24 },
  card:      { backgroundColor: COLORS.card, borderRadius: 16, padding: 28, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
  title:     { fontSize: 28, fontWeight: '800', color: COLORS.primary, textAlign: 'center', marginBottom: 4 },
  subtitle:  { fontSize: 16, color: COLORS.textLight, textAlign: 'center', marginBottom: 24 },
  input:     { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 14, fontSize: 15, color: COLORS.text },
  btn:       { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  btnText:   { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  link:      { textAlign: 'center', color: COLORS.primary, fontSize: 14 },
});
