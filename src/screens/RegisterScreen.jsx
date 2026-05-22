import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { COLORS } from '../constants/colors';

export default function RegisterScreen({ navigation }) {
  const register = useAuthStore((s) => s.register);
  const [form, setForm]       = useState({ name: '', username: '', email: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (form.password !== form.password_confirmation) return Alert.alert('Error', 'Las contraseñas no coinciden');
    setLoading(true);
    try {
      await register(form);
    } catch (e) {
      const errors = e.response?.data?.errors;
      const msg    = errors ? Object.values(errors).flat().join('\n') : 'Error al registrarse';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const field = (key, placeholder, opts = {}) => (
    <TextInput
      key={key}
      style={s.input}
      placeholder={placeholder}
      autoCapitalize="none"
      value={form[key]}
      onChangeText={(v) => setForm({ ...form, [key]: v })}
      {...opts}
    />
  );

  return (
    <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
      <View style={s.card}>
        <Text style={s.title}>Crear cuenta</Text>
        {field('name',                  'Nombre completo',          { autoCapitalize: 'words' })}
        {field('username',              'Nombre de usuario')}
        {field('email',                 'Correo electrónico',       { keyboardType: 'email-address' })}
        {field('password',              'Contraseña',               { secureTextEntry: true })}
        {field('password_confirmation', 'Confirmar contraseña',     { secureTextEntry: true })}

        <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={s.btnText}>Registrarse</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: COLORS.background, justifyContent: 'center', padding: 24 },
  card:      { backgroundColor: COLORS.card, borderRadius: 16, padding: 28, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 4 },
  title:     { fontSize: 24, fontWeight: '800', color: COLORS.primary, textAlign: 'center', marginBottom: 20 },
  input:     { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 14, fontSize: 15, color: COLORS.text },
  btn:       { backgroundColor: COLORS.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  btnText:   { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  link:      { textAlign: 'center', color: COLORS.primary, fontSize: 14 },
});
