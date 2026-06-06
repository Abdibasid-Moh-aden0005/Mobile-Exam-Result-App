import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import { ActivityIndicator, View } from "react-native";

import LoginScreen from "./src/screens/auth/LoginScreen";
import AdminDashboardScreen from "./src/screens/admin/AdminDashboardScreen";
import StudentsScreen from "./src/screens/admin/StudentsScreen";
import CoursesScreen from "./src/screens/admin/CoursesScreen";
import ResultsScreen from "./src/screens/admin/ResultsScreen";
import StudentDashboardScreen from "./src/screens/student/StudentDashboardScreen";
import StudentResultsScreen from "./src/screens/student/StudentResultsScreen";
import StudentProfileScreen from "./src/screens/student/StudentProfileScreen";

import useAuthStore from "./src/stores/authStore";

const Stack = createNativeStackNavigator();

const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{ title: "Admin Dashboard" }}
    />
    <Stack.Screen
      name="Students"
      component={StudentsScreen}
      options={{ title: "Students" }}
    />
    <Stack.Screen
      name="Courses"
      component={CoursesScreen}
      options={{ title: "Courses" }}
    />
    <Stack.Screen
      name="Results"
      component={ResultsScreen}
      options={{ title: "Results" }}
    />
  </Stack.Navigator>
);

const StudentStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="StudentDashboard"
      component={StudentDashboardScreen}
      options={{ title: "Dashboard" }}
    />
    <Stack.Screen
      name="StudentResults"
      component={StudentResultsScreen}
      options={{ title: "My Results" }}
    />
    <Stack.Screen
      name="StudentProfile"
      component={StudentProfileScreen}
      options={{ title: "My Profile" }}
    />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const { user, role, handleAuthenticatedUser, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await handleAuthenticatedUser(firebaseUser);
      } else {
        useAuthStore.getState().clearSession();
      }

      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : role === "admin" ? (
        <AdminStack />
      ) : (
        <StudentStack />
      )}
    </NavigationContainer>
  );
}
