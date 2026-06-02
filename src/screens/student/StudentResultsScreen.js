import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import useAuthStore from '../../stores/authStore';
import useResultStore from '../../stores/resultStore';
import useCourseStore from '../../stores/courseStore';

const StudentResultsScreen = () => {
  const { studentId } = useAuthStore();
  const { studentResults, loading, fetchResultsByStudent } = useResultStore();
  const { courses, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses();
    if (studentId) {
      fetchResultsByStudent(studentId);
    }
  }, [studentId]);

  const getCourseInfo = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course || null;
  };

  const calculateGPA = () => {
    if (studentResults.length === 0) return 0;
    const gradePoints = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0.0 };
    let totalPoints = 0;
    let totalCredits = 0;
    studentResults.forEach((result) => {
      const course = getCourseInfo(result.courseId);
      const credits = course?.creditHours || 0;
      totalPoints += (gradePoints[result.grade] || 0) * credits;
      totalCredits += credits;
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const renderItem = ({ item }) => {
    const course = getCourseInfo(item.courseId);
    return (
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.courseCode}>{course?.code || 'Unknown'}</Text>
          <Text style={styles.courseTitle}>{course?.title || 'Unknown'}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.score}>{item.score}</Text>
          <View style={[styles.gradeBadge, {
            backgroundColor: item.grade === 'A' ? '#34C759' : item.grade === 'F' ? '#FF3B30' : '#FF9500'
          }]}>
            <Text style={styles.gradeText}>{item.grade}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.gpaCard}>
        <Text style={styles.gpaLabel}>Semester GPA</Text>
        <Text style={styles.gpaValue}>{calculateGPA()}</Text>
        <Text style={styles.resultCount}>{studentResults.length} result(s)</Text>
      </View>

      <FlatList
        data={studentResults}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No results published yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  gpaCard: { backgroundColor: '#007AFF', padding: 24, margin: 16, borderRadius: 14, alignItems: 'center' },
  gpaLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  gpaValue: { color: '#fff', fontSize: 40, fontWeight: '700', marginVertical: 4 },
  resultCount: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  left: { flex: 1 },
  courseCode: { fontSize: 15, fontWeight: '700', color: '#007AFF' },
  courseTitle: { fontSize: 14, color: '#333', marginTop: 2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  score: { fontSize: 18, fontWeight: '700' },
  gradeBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14 },
  gradeText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 },
});

export default StudentResultsScreen;
