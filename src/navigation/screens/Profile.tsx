import React, { useState, useEffect } from 'react';
import { ScrollView , Text, Image, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { db, auth, storage } from '../../firebase'; // Ensure storage is exported from your Firebase config
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage functions
import * as ImagePicker from 'expo-image-picker';

// Default profile image URL
const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/100';

export function Profile() {
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE); // Set default image initially
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data from Firestore and email from Firebase Auth
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Fetch email from Firebase Auth
          setEmail(user.email || '');

          // Fetch additional profile data from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUsername(data.username || '');
            setProfileImage(data.profileImage || DEFAULT_PROFILE_IMAGE); // Use default image if no profile image exists
          }
        }
      } catch (error) {
        console.error("Error fetching profile data: ", error);
      }
    };

    fetchProfileData();
  }, []);

  // For picking a profile image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Set the local URI for preview
    }
  };

  // Upload image to Firebase Storage and return the download URL
  const uploadImage = async (uri: string | URL | Request) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`); // Unique path for each user
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  // Save edited data to Firestore
  const handleSave = async () => {
    try {
      let imageUrl = profileImage;

      // If the profile image is not the default image and has been changed, upload it
      if (profileImage !== DEFAULT_PROFILE_IMAGE && profileImage.startsWith('file:')) {
        imageUrl = await uploadImage(profileImage);
      }

      const userData = { username, email, profileImage: imageUrl };
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userDocRef, userData, { merge: true });

      Alert.alert('Profile Updated', `Username: ${username}\nEmail: ${email}`);
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "Could not save profile data. Please try again.");
    }
  };

  return (
    <ScrollView  style={styles.container}>
      <Text style={styles.header}>{isEditing ? 'Edit Profile' : 'Profile'}</Text>
      
      <ScrollView  style={styles.detailContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity onPress={pickImage}>
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
              <Text style={styles.changeImageText}>Change Profile Image</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={styles.input}
              value={email}
              editable={false} // Email is not editable
              placeholder="Email"
              placeholderTextColor="#aaa"
            />
          </>
        ) : (
          <>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <Text style={styles.detail}>Username: {username}</Text>
            <Text style={styles.detail}>Email: {email}</Text>
          </>
        )}
      </ScrollView>

      {isEditing ? (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f9',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
    color: '#4a90e2',
  },
  detailContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    alignSelf: 'center', // Center the image
  },
  changeImageText: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
});