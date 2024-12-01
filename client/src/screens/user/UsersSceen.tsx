import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Alert,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios"; // For handling HTTP requests

const { width, height } = Dimensions.get("window");

const UsersScreen = () => {
  const [users, setUsers] = useState<any[]>([]); // Store users here
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://192.168.1.38:5000/auth/users");
      setUsers(response.data.users); 
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: any) => {
    setCurrentUser(user);
    setEditedUsername(user.username);
    setEditedEmail(user.email);
    setIsModalVisible(true);
  };


  const handleSaveEdit = async () => {
    if (!editedUsername || !editedEmail) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(
        `http://192.168.1.38:5000/auth/users/${currentUser.id}`,
        {
          username: editedUsername,
          email: editedEmail,
        }
      );
      Alert.alert("Success", "User updated successfully.");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === currentUser.id
            ? { ...user, username: editedUsername, email: editedEmail }
            : user
        )
      );
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating user:", error);
      Alert.alert("Error", "Failed to update user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (userId: string) => {
    Alert.alert("Confirm Deletion", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true);
            await axios.delete(`http://192.168.1.38:5000/auth/users/${userId}`);
            Alert.alert("Success", "User deleted successfully.");
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
          } catch (error) {
            console.error("Error deleting user:", error);
            Alert.alert("Error", "Failed to delete user.");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

 
  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`http://192.168.1.38:5000/auth/users/${currentUser.id}/reset-password`, {
        newPassword,
      });
      Alert.alert("Success", "Password reset successfully.");
      setResetPasswordVisible(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error", "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View className="flex-1">
      {isLoading && (
        <View className="absolute z-50 h-full w-full justify-center items-center">
          <View className="h-full w-full justify-center items-center bg-black opacity-[0.45]"></View>
          <View className="absolute">
            <ActivityIndicator size="large" color="white" />
          </View>
        </View>
      )}

      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row justify-start items-center px-4 py-4">
          <Text className="text-lg font-bold">Users</Text>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="p-4 border-b">
              <Text className="text-xl font-semibold">{item.username}</Text>
              <Text className="text-sm text-neutral-500">{item.email}</Text>
              <View className="flex-row justify-between mt-2">
                <Button title="Edit" onPress={() => handleEdit(item)} color="blue" />
                <Button title="Delete" onPress={() => handleDelete(item.id)} color="red" />
                <Button
                  title="Reset Password"
                  onPress={() => {
                    setCurrentUser(item);
                    setResetPasswordVisible(true);
                  }}
                  color="green"
                />
              </View>
            </View>
          )}
        />
      </SafeAreaView>

      {/* Edit User Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white w-[90%] rounded-lg p-6">
            <Text className="text-lg font-bold mb-4">Edit User</Text>
            <TextInput
              className="border p-2 mb-4 rounded"
              placeholder="Username"
              value={editedUsername}
              onChangeText={setEditedUsername}
            />
            <TextInput
              className="border p-2 mb-4 rounded"
              placeholder="Email"
              value={editedEmail}
              onChangeText={setEditedEmail}
            />
            <View className="flex-row justify-between">
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="gray" />
              <Button title="Save" onPress={handleSaveEdit} color="blue" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        visible={resetPasswordVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setResetPasswordVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white w-[90%] rounded-lg p-6">
            <Text className="text-lg font-bold mb-4">Reset Password</Text>
            <TextInput
              className="border p-2 mb-4 rounded"
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <View className="flex-row justify-between">
              <Button
                title="Cancel"
                onPress={() => setResetPasswordVisible(false)}
                color="gray"
              />
              <Button title="Reset" onPress={handleResetPassword} color="green" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UsersScreen;
