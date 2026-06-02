import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Modal, FlatList,
} from 'react-native';
import { calculateGrade } from '../utils/calculateGrade';

const ResultForm = ({ onSubmit, initialData, students, courses, onCancel }) => {
  const [selectedStudent, setSelectedStudent] = useState(initialData?.studentData || null);
  const [selectedCourse, setSelectedCourse] = useState(initialData?.courseData || null);
  const [score, setScore] = useState(initialData?.score?.toString() || '');
  const [semester, setSemester] = useState(initialData?.semester || '');
  const [academicYear, setAcademicYear] = useState(initialData?.academicYear || '');
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [showStudentPicker, setShowStudentPicker] = useState(false);
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  const filteredStudents = students.filter((s) =>
    !studentSearch || `${s.firstName} ${s.lastName} ${s.registrationNumber}`.toLowerCase().includes(studentSearch.toLowerCase())
  );
  const filteredCourses = courses.filter((c) =>
    !courseSearch || `${c.code} ${c.title}`.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const handleSubmit = () => {
    if (!selectedStudent || !selectedCourse || !score || !semester || !academicYear) {
      alert('All fields are required');
      return;
    }
    const numericScore = Number(score);
    const grade = calculateGrade(numericScore);
    onSubmit({
      studentId: selectedStudent.id,
      courseId: selectedCourse.id,
      score: numericScore,
      grade,
      semester,
      academicYear,
      published,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Student *</Text>
      <TouchableOpacity style={styles.picker} onPress={() => setShowStudentPicker(true)}>
        <Text style={selectedStudent ? styles.pickerText : styles.placeholder}>
          {selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName} - ${selectedStudent.registrationNumber}` : 'Select a student...'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Course *</Text>
      <TouchableOpacity style={styles.picker} onPress={() => setShowCoursePicker(true)}>
        <Text style={selectedCourse ? styles.pickerText : styles.placeholder}>
          {selectedCourse ? `${selectedCourse.code} - ${selectedCourse.title}` : 'Select a course...'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Score *</Text>
      <TextInput style={styles.input} value={score} onChangeText={setScore} keyboardType="numeric" />

      <Text style={styles.label}>Semester *</Text>
      <TextInput style={styles.input} value={semester} onChangeText={setSemester} />

      <Text style={styles.label}>Academic Year *</Text>
      <TextInput style={styles.input} value={academicYear} onChangeText={setAcademicYear} />

      <Text style={styles.label}>Published</Text>
      <TouchableOpacity style={[styles.toggle, published && styles.toggleActive]} onPress={() => setPublished(!published)}>
        <Text style={[styles.toggleText, published && styles.toggleTextActive]}>{published ? 'Yes' : 'No'}</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        {onCancel && (
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{initialData ? 'Update' : 'Create'} Result</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showStudentPicker} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Student</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search students..."
            value={studentSearch}
            onChangeText={setStudentSearch}
          />
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pickerItem}
                onPress={() => {
                  setSelectedStudent(item);
                  setShowStudentPicker(false);
                  setStudentSearch('');
                }}
              >
                <Text>{item.firstName} {item.lastName} - {item.registrationNumber}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={() => { setShowStudentPicker(false); setStudentSearch(''); }}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={showCoursePicker} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Course</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            value={courseSearch}
            onChangeText={setCourseSearch}
          />
          <FlatList
            data={filteredCourses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pickerItem}
                onPress={() => {
                  setSelectedCourse(item);
                  setShowCoursePicker(false);
                  setCourseSearch('');
                }}
              >
                <Text>{item.code} - {item.title}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeBtn} onPress={() => { setShowCoursePicker(false); setCourseSearch(''); }}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, backgroundColor: '#f9f9f9' },
  pickerText: { fontSize: 16 },
  placeholder: { fontSize: 16, color: '#999' },
  toggle: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', alignItems: 'center' },
  toggleActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  toggleText: { fontSize: 16 },
  toggleTextActive: { color: '#fff' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 40 },
  button: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  submitButton: { backgroundColor: '#007AFF' },
  cancelButton: { backgroundColor: '#8e8e93' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalContainer: { flex: 1, padding: 20, paddingTop: 60 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  pickerItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  closeBtn: { padding: 14, alignItems: 'center', marginTop: 10 },
  closeBtnText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
});

export default ResultForm;
