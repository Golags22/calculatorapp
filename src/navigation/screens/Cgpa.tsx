import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
// import { db } from './firebase'; // Uncomment and configure Firebase
import { useNavigation } from '@react-navigation/native';

export function Cgpa() {
  const navigation = useNavigation();

  const [numSemesters, setNumSemesters] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [courseErrors, setCourseErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  // Loading state for calculation

  const gradeMapping = {
    'A': { min: 75, max: 100, point: 4.00 },
    'AB': { min: 70, max: 74, point: 3.50 },
    'B': { min: 65, max: 69, point: 3.25 },
    'BC': { min: 60, max: 64, point: 3.00 },
    'C': { min: 55, max: 59, point: 2.75 },
    'CD': { min: 50, max: 54, point: 2.50 },
    'D': { min: 45, max: 49, point: 2.25 },
    'E': { min: 40, max: 44, point: 2.00 },
    'F': { min: 0, max: 39, point: 0.00 },
  };

  const getGradePoint = (score) => {
    for (const [grade, { min, max, point }] of Object.entries(gradeMapping)) {
      if (score >= min && score <= max) {
        return { grade, point: point.toFixed(2) };
      }
    }
    return { grade: '', point: 0.00 };
  };

  const handleNumSemestersSubmit = () => {
    const totalSemesters = parseInt(numSemesters);
    if (isNaN(totalSemesters) || totalSemesters < 2 || totalSemesters > 4) {
      setErrorMessage('Please enter a valid number of semesters (between 2 and 4).');
      return;
    }
    setErrorMessage('');
    const newSemesters = Array.from({ length: totalSemesters }, () => ({
      courses: [],
    }));
    setSemesters(newSemesters);
    setNumSemesters('');
  };

  const handleCourseInputChange = (semesterIndex, index, field, value) => {
    const updatedSemesters = [...semesters];
    const updatedCourses = [...updatedSemesters[semesterIndex].courses];
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };

    if (field === 'score') {
      const numericScore = parseFloat(value);
      const { grade, point } = getGradePoint(numericScore);
      updatedCourses[index].gradePoint = point;
      updatedCourses[index].grade = grade;
    }
    
    if (field === 'score' || field === 'unit') {
      validateCourseFields(updatedSemesters, semesterIndex, index);
    }

    updatedSemesters[semesterIndex].courses = updatedCourses;
    setSemesters(updatedSemesters);
  };

  const validateCourseFields = (updatedSemesters, semesterIndex, index) => {
    const errors = [...courseErrors];
    const course = updatedSemesters[semesterIndex].courses[index];
    let error = '';

    if (isNaN(course.score) || course.score === '') {
      error = 'Please enter a valid score.';
    } else if (isNaN(course.unit) || course.unit === '') {
      error = 'Please enter a valid credit unit.';
    }
    errors[semesterIndex] = errors[semesterIndex] || [];
    errors[semesterIndex][index] = error;
    setCourseErrors(errors);
  };

  const calculateResult = () => {
    setIsLoading(true); // Start loading

    let totalPoints = 0;
    let totalCredits = 0;
    let hasErrors = false;

    semesters.forEach((semester, semesterIndex) => {
      semester.courses.forEach((course, index) => {
        if (courseErrors[semesterIndex] && courseErrors[semesterIndex][index]) {
          hasErrors = true;
        } else {
          const gradePoint = parseFloat(course.gradePoint || 0);
          const numericCredit = parseFloat(course.unit || 0);
          if (!isNaN(gradePoint) && !isNaN(numericCredit)) {
            totalPoints += gradePoint * numericCredit;
            totalCredits += numericCredit;
          }
        }
      });
    });

    setIsLoading(false); // End loading

    if (hasErrors) {
      Alert.alert('Error', 'Please fix the errors before calculating.');
      return;
    }

    if (totalCredits > 0) {
      const calculatedResult = (totalPoints / totalCredits).toFixed(2);
      setResult(calculatedResult);  // Set CGPA value with the formatted result
    } else {
      Alert.alert('Error', 'Please ensure all fields are filled correctly.');
    }
  };

  const resetForm = () => {
    setSemesters([]);
    setResult(null);
    setNumSemesters('');
    setErrorMessage('');
    setCourseErrors([]);
  };

  const saveResult = () => {
    // Firebase save functionality (commented out for now)
    // db.collection('cgpaResults').add({
    //   semesters: semesters,
    //   result: result,
    //   timestamp: new Date(),
    // })
    // .then(() => {
    //   Alert.alert('Saved', 'Your CGPA result has been saved successfully.');
    // })
    // .catch((error) => {
    //   Alert.alert('Error', 'Failed to save your result.');
    // });
  };

  const removeCourse = (semesterIndex, courseIndex) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex].courses.splice(courseIndex, 1);
    setSemesters(updatedSemesters);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>CGPA Calculation</Text>
      {semesters.length === 0 ? (
        <>
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Total Number of Semesters (2-4)"
            keyboardType="numeric"
            value={numSemesters}
            onChangeText={setNumSemesters}
          />
          <TouchableOpacity onPress={handleNumSemestersSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Start Adding Semesters</Text>
          </TouchableOpacity>
          <View style={styles.grades}>
                  <Text style={styles.header}>Grade Scale</Text>
                  <View style={styles.scales}>
                    <Text style={styles.scaleText}>A = 75 - 100 point: 4.00</Text>
                    <Text style={styles.scaleText}>AB = 70 - 74 point: 3.50</Text>
                    <Text style={styles.scaleText}>B = 65 - 69 point: 3.25</Text>
                    <Text style={styles.scaleText}>BC = 60 - 64 point: 3.00</Text>
                    <Text style={styles.scaleText}>C = 55 - 59 point: 2.75</Text>
                    <Text style={styles.scaleText}>CD = 50 - 54 point: 2.50</Text>
                    <Text style={styles.scaleText}>D = 45 - 49 point: 2.25</Text>
                    <Text style={styles.scaleText}>E = 40 - 44 point: 2.00</Text>
                    <Text style={styles.scaleText}>F = 0 - 39 point: 0.00</Text>
                  </View>
                </View>
        </>

      ) : (
        <>
          {semesters.map((semester, semesterIndex) => (
            <View key={semesterIndex} style={styles.semesterContainer}>
              <Text style={styles.semesterHeader}>Semester {semesterIndex + 1}</Text>
              <FlatList
                data={semester.courses}
                renderItem={({ item, index }) => (
                  <View style={styles.courseContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Course Code"
                      value={item.code}
                      onChangeText={(value) => handleCourseInputChange(semesterIndex, index, 'code', value)}
                    />
                    <TextInput
                      style={[styles.input, courseErrors[semesterIndex] && courseErrors[semesterIndex][index] ? styles.errorInput : null]}
                      placeholder="Score (e.g., 85)"
                      keyboardType="numeric"
                      value={item.score}
                      onChangeText={(value) => handleCourseInputChange(semesterIndex, index, 'score', value)}
                    />
                    {courseErrors[semesterIndex] && courseErrors[semesterIndex][index] ? (
                      <Text style={styles.error}>{courseErrors[semesterIndex][index]}</Text>
                    ) : null}
                    <TextInput
                      style={[styles.input, courseErrors[semesterIndex] && courseErrors[semesterIndex][index] ? styles.errorInput : null]}
                      placeholder="Credits (e.g., 3)"
                      keyboardType="numeric"
                      value={item.unit}
                      onChangeText={(value) => handleCourseInputChange(semesterIndex, index, 'unit', value)}
                    />
                    {courseErrors[semesterIndex] && courseErrors[semesterIndex][index] ? (
                      <Text style={styles.error}>{courseErrors[semesterIndex][index]}</Text>
                    ) : null}
                    <Text>
                      Grade: {item.grade} (Point: {item.gradePoint})
                    </Text>
                    <TouchableOpacity onPress={() => removeCourse(semesterIndex, index)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Remove Course</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <TouchableOpacity onPress={() => {
                const updatedSemesters = [...semesters];
                updatedSemesters[semesterIndex].courses.push({ code: '', score: '', unit: '', gradePoint: '', grade: '' });
                setSemesters(updatedSemesters);
              }} style={styles.button}>
                <Text style={styles.buttonText}>Add Course to Semester {semesterIndex + 1}</Text>
              </TouchableOpacity>
            </View>
          ))}
          {isLoading ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : (
            <>
              <TouchableOpacity onPress={calculateResult} style={styles.button}>
                <Text style={styles.buttonText}>Calculate CGPA</Text>
              </TouchableOpacity>
              {result !== null && (
                <>
                  <Text>Your cumulative CGPA is: {result}</Text>
                  <View style={styles.resultButtons}>
                    <TouchableOpacity onPress={resetForm} style={styles.button}>
                      <Text style={styles.buttonText}>Calculate Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={saveResult} style={styles.button}>
                      <Text style={styles.buttonText}>Save Result</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    fontSize: 16,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  semesterContainer: {
    marginBottom: 20,
  },
  semesterHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseContainer: {
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  errorInput: {
    borderColor: 'red',
  },
  resultButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 8,
    marginTop: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  
  grades: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  scales: {
    flexDirection: 'column',
    marginVertical: 10,
  },
  scaleText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    lineHeight: 24,
  },
});

export default Cgpa;
