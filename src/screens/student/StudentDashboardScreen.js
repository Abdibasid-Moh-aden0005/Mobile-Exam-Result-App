import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useAuthStore from '../../stores/authStore';

const StudentDashboardScreen = ({ navigation }) => {
  const { logout, user } = useAuthStore();

  const menuItems = [
    { title: 'My Results', screen: 'StudentResults', icon: '📊' },
    { title: 'My Profile', screen: 'StudentProfile', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Student Dashboard</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { marginTop: 20, marginBottom: 30 },
  welcome: { fontSize: 26, fontWeight: '700' },
  email: { fontSize: 14, color: '#666', marginTop: 4 },
  menu: { flex: 1 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: { fontSize: 24, marginRight: 14 },
  menuTitle: { fontSize: 17, fontWeight: '500', flex: 1 },
  arrow: { fontSize: 24, color: '#ccc' },
  logoutBtn: { padding: 16, alignItems: 'center', marginBottom: 20 },
  logoutText: { color: '#FF3B30', fontSize: 16, fontWeight: '600' },
});

export default StudentDashboardScreen;
