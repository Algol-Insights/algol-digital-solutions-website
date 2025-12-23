import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, Pressable, StyleSheet } from 'react-native'

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Algol Admin' }} />
      </Stack>
    </SafeAreaView>
  )
}

export function Index() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Algol Admin Mobile</Text>
      <Text style={styles.subtitle}>Quick access to orders, inventory, and alerts.</Text>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220' },
  screen: { flex: 1, padding: 24, gap: 12, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#cbd5e1', fontSize: 14 },
  button: { backgroundColor: '#2563eb', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
})
