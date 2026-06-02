import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const CourseForm = ({ onSubmit, initialData, onCancel }) => {
  const [code, setCode] = useState(initialData?.code || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [creditHours, setCreditHours] = useState(initialData?.creditHours?.toString() || '');
  const [department, setDepartment] = useState(initialData?.department || '');
  const [level, setLevel] = useState(initialData?.level || '');

  const handleSubmit = () => {
    if (!code || !title) {
      alert('Course code and title are required');
      return;
    }
    onSubmit({
      code,
      title,
      creditHours: Number(creditHours),
      department,
      level,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Course Code *</Text>
      <TextInput style={styles.input} value={code} onChangeText={setCode} />

      <Text style={styles.label}>Course Title *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Credit Hours</Text>
      <TextInput style={styles.input} value={creditHours} onChangeText={setCreditHours} keyboardType="numeric" />

      <Text style={styles.label}>Department</Text>
      <TextInput style={styles.input} value={department} onChangeText={setDepartment} />

      <Text style={styles.label}>Level</Text>
      <TextInput style={styles.input} value={level} onChangeText={setLevel} />

      <View style={styles.buttonRow}>
        {onCancel && (
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{initialData ? 'Update' : 'Create'} Course</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 40 },
  button: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  submitButton: { backgroundColor: '#007AFF' },
  cancelButton: { backgroundColor: '#8e8e93' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default CourseForm;
