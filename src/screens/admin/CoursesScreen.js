import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import useCourseStore from '../../stores/courseStore';
import CourseForm from '../../components/CourseForm';
import CourseList from '../../components/CourseList';

const CoursesScreen = () => {
  const { courses, loading, fetchCourses, createCourse, updateCourse, deleteCourse } = useCourseStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreate = () => {
    setEditingCourse(null);
    setModalVisible(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setModalVisible(true);
  };

  const handleSubmit = async (data) => {
    if (editingCourse) {
      await updateCourse(editingCourse.id, data);
    } else {
      await createCourse(data);
    }
    setModalVisible(false);
    setEditingCourse(null);
    fetchCourses();
  };

  const handleDelete = async (id) => {
    await deleteCourse(id);
    fetchCourses();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addBtn} onPress={handleCreate}>
        <Text style={styles.addBtnText}>+ Add Course</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <CourseList courses={courses} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{editingCourse ? 'Edit Course' : 'Add Course'}</Text>
        </View>
        <CourseForm
          onSubmit={handleSubmit}
          initialData={editingCourse}
          onCancel={() => { setModalVisible(false); setEditingCourse(null); }}
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

export default CoursesScreen;
