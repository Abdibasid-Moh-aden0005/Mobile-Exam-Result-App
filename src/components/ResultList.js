import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ResultList = ({ results, students, courses, onEdit, onDelete }) => {
  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown';
  };

  const getCourseInfo = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? `${course.code} - ${course.title}` : 'Unknown';
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Result', 'Are you sure you want to delete this result?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(id) },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.student}>{getStudentName(item.studentId)}</Text>
        <Text style={styles.course}>{getCourseInfo(item.courseId)}</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.score}>Score: {item.score}</Text>
          <View style={[styles.gradeBadge, { backgroundColor: item.grade === 'A' ? '#34C759' : item.grade === 'F' ? '#FF3B30' : '#FF9500' }]}>
            <Text style={styles.gradeText}>{item.grade}</Text>
          </View>
          <Text style={styles.meta}>{item.semester} | {item.academicYear}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={styles.empty}>No results found</Text>}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  info: { flex: 1 },
  student: { fontSize: 16, fontWeight: '600' },
  course: { fontSize: 14, color: '#007AFF', marginTop: 2 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  score: { fontSize: 13, color: '#333' },
  gradeBadge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12 },
  gradeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  meta: { fontSize: 12, color: '#666' },
  actions: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#007AFF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  deleteBtn: { backgroundColor: '#FF3B30', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6 },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
});

export default ResultList;
