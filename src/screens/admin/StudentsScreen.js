import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import useStudentStore from '../../stores/studentStore';
import StudentForm from '../../components/StudentForm';
import StudentTable from '../../components/StudentTable';

const StudentsScreen = () => {
  const { students, loading, fetchStudents, createStudent, updateStudent, deleteStudent } = useStudentStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreate = () => {
    setEditingStudent(null);
    setModalVisible(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setModalVisible(true);
  };

  const handleSubmit = async (data) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, data);
    } else {
      await createStudent(data);
    }
    setModalVisible(false);
    setEditingStudent(null);
    fetchStudents();
  };

  const handleDelete = async (id) => {
    await deleteStudent(id);
    fetchStudents();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={handleCreate}>
        <Text style={styles.addBtnText}>+ Add Student</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <StudentTable students={students} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{editingStudent ? 'Edit Student' : 'Add Student'}</Text>
        </View>
        <StudentForm
          onSubmit={handleSubmit}
          initialData={editingStudent}
          onCancel={() => { setModalVisible(false); setEditingStudent(null); }}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  addBtn: { backgroundColor: '#007AFF', margin: 16, padding: 14, borderRadius: 10, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalHeader: { padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  modalTitle: { fontSize: 22, fontWeight: '700' },
});

export default StudentsScreen;
