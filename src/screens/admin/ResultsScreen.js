import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import useResultStore from '../../stores/resultStore';
import useStudentStore from '../../stores/studentStore';
import useCourseStore from '../../stores/courseStore';
import ResultForm from '../../components/ResultForm';
import ResultList from '../../components/ResultList';

const ResultsScreen = () => {
  const { results, loading, fetchResults, createResult, updateResult, deleteResult } = useResultStore();
  const { students, fetchStudents } = useStudentStore();
  const { courses, fetchCourses } = useCourseStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingResult, setEditingResult] = useState(null);

  useEffect(() => {
    fetchResults();
    fetchStudents();
    fetchCourses();
  }, []);

  const handleCreate = () => {
    setEditingResult(null);
    setModalVisible(true);
  };

  const handleEdit = (result) => {
    const studentData = students.find((s) => s.id === result.studentId);
    const courseData = courses.find((c) => c.id === result.courseId);
    setEditingResult({ ...result, studentData, courseData });
    setModalVisible(true);
  };

  const handleSubmit = async (data) => {
    if (editingResult) {
      await updateResult(editingResult.id, data);
    } else {
      await createResult(data);
    }
    setModalVisible(false);
    setEditingResult(null);
    fetchResults();
  };

  const handleDelete = async (id) => {
    await deleteResult(id);
    fetchResults();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={handleCreate}>
        <Text style={styles.addBtnText}>+ Add Result</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <ResultList
          results={results}
          students={students}
          courses={courses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{editingResult ? 'Edit Result' : 'Add Result'}</Text>
        </View>
        <ResultForm
          onSubmit={handleSubmit}
          initialData={editingResult}
          students={students}
          courses={courses}
          onCancel={() => { setModalVisible(false); setEditingResult(null); }}
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

export default ResultsScreen;
