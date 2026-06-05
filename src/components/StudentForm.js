import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const StudentForm = ({ onSubmit, initialData, onCancel }) => {
  const [firstName, setFirstName] = useState(initialData?.firstName || "");
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [studentID, setStudentID] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState(
    initialData?.registrationNumber || "",
  );
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [address, setAddress] = useState(initialData?.address || "");

  const handleSubmit = () => {
    if ((!firstName || !lastName || !registrationNumber, !studentID)) {
      alert(
        "First name, last name,student id  and registration number are required",
      );
      return;
    }
    onSubmit({
      firstName,
      lastName,
      registrationNumber,
      studentID,
      email,
      phone,
      department,
      address,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>First Name *</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last Name *</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>student id *</Text>
      <TextInput
        style={styles.input}
        value={studentID}
        onChangeText={(value) => setStudentID(value)}
      />

      <Text style={styles.label}>Registration Number *</Text>
      <TextInput
        style={styles.input}
        value={registrationNumber}
        onChangeText={setRegistrationNumber}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Department</Text>
      <TextInput
        style={styles.input}
        value={department}
        onChangeText={setDepartment}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <View style={styles.buttonRow}>
        {onCancel && (
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>
            {initialData ? "Update" : "Create"} Student
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 4, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  submitButton: { backgroundColor: "#007AFF" },
  cancelButton: { backgroundColor: "#8e8e93" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default StudentForm;
