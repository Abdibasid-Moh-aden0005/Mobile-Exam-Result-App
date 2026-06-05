import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import useAuthStore from "../../stores/authStore";
import useStudentStore from "../../stores/studentStore";

const StudentProfileScreen = () => {
  const { studentId } = useAuthStore();
  const { selectedStudent, fetchStudentById, loading } = useStudentStore();

  useEffect(() => {
    if (studentId) {
      fetchStudentById(studentId);
    }
  }, [studentId]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#007AFF"
        style={{ marginTop: 40 }}
      />
    );
  }

  if (!selectedStudent) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Profile not found</Text>
      </View>
    );
  }

  const fields = [
    { label: "First Name", value: selectedStudent.firstName },
    { label: "Last Name", value: selectedStudent.lastName },
    { label: "student ID", value: selectedStudent.studentID },
    { label: "Registration Number", value: selectedStudent.registrationNumber },
    { label: "Email", value: selectedStudent.email },
    { label: "Phone", value: selectedStudent.phone },
    { label: "Department", value: selectedStudent.department },
    { label: "Address", value: selectedStudent.address },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {selectedStudent.firstName?.[0]}
          {selectedStudent.lastName?.[0]}
        </Text>
      </View>
      <Text style={styles.fullName}>
        {selectedStudent.firstName} {selectedStudent.lastName}
      </Text>

      <View style={styles.card}>
        {fields.map((field) => (
          <View key={field.label} style={styles.fieldRow}>
            <Text style={styles.label}>{field.label}</Text>
            <Text style={styles.value}>{field.value || "-"}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  fullName: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 20 },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: { fontSize: 14, color: "#666", fontWeight: "500" },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },
  empty: { textAlign: "center", color: "#999", marginTop: 40, fontSize: 16 },
});

export default StudentProfileScreen;
