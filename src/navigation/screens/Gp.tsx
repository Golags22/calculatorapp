import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ImageBackground, FlatList, Text, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export function Gp() {
  const navigation = useNavigation();

  const [numCourses, setNumCourses] = useState('');
  const [courses, setCourses] = useState([]);
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

  const handleNumCoursesSubmit = () => {
    const totalCourses = parseInt(numCourses);
    if (isNaN(totalCourses) || totalCourses <= 0) {
      setErrorMessage('Please enter a valid number of courses.');
      return;
    }
    setErrorMessage('');
    const newCourses = Array.from({ length: totalCourses }, () => ({
      code: '',
      score: '',
      unit: '',
      gradePoint: '',
      grade: '',
    }));
    setCourses(newCourses);
    setNumCourses('');
  };

  const handleInputChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;

    if (field === 'score') {
      const numericScore = parseFloat(value);
      const { grade, point } = getGradePoint(numericScore);
      updatedCourses[index].gradePoint = point;
      updatedCourses[index].grade = grade;
    }
    
    if (field === 'score' || field === 'unit') {
      validateCourseFields(updatedCourses, index);
    }

    setCourses(updatedCourses);
  };

  const validateCourseFields = (updatedCourses, index) => {
    const errors = [...courseErrors];
    const course = updatedCourses[index];
    let error = '';

    if (isNaN(course.score) || course.score === '') {
      error = 'Please enter a valid score.';
    } else if (isNaN(course.unit) || course.unit === '') {
      error = 'Please enter a valid credit unit.';
    }
    errors[index] = error;
    setCourseErrors(errors);
  };

  const calculateResult = () => {
    setIsLoading(true); // Start loading

    let totalPoints = 0;
    let totalCredits = 0;
    let hasErrors = false;

    courses.forEach((course, index) => {
      if (courseErrors[index]) {
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

    setIsLoading(false); // End loading

    if (hasErrors) {
      Alert.alert('Error', 'Please fix the errors before calculating.');
      return;
    }

    if (totalCredits > 0) {
      const calculatedResult = (totalPoints / totalCredits).toFixed(2);
      setResult(calculatedResult);  // Set GPA value with the formatted result
    } else {
      Alert.alert('Error', 'Please ensure all fields are filled correctly.');
    }
  };

  const resetForm = () => {
    setCourses([]);
    setResult(null);
    setNumCourses('');
    setErrorMessage('');
    setCourseErrors([]);
  };

  const saveResult = () => {
    Firebase save functionality (commented out for now)
    db.collection('gpaResults').add({
      courses: courses,
      result: result,
      timestamp: new Date(),
    })
    .then(() => {
      Alert.alert('Saved', 'Your GPA result has been saved successfully.');
    })
    .catch((error) => {
      Alert.alert('Error', 'Failed to save your result.');
    });
  };

  return (
   
      <ScrollView style={styles.container}>
        <Text style={styles.header}>GPA Calculation</Text>
        {courses.length === 0 ? (
          <>
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Total Number of Courses"
              keyboardType="numeric"
              value={numCourses}
              onChangeText={setNumCourses}
            />
            <TouchableOpacity onPress={handleNumCoursesSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Start Adding Courses</Text>
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
            <FlatList
              data={courses}
              renderItem={({ item, index }) => (
                <View style={styles.courseContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Course Code"
                    value={item.code}
                    onChangeText={(value) => handleInputChange(index, 'code', value)}
                  />
                  <TextInput
                    style={[styles.input, courseErrors[index] ? styles.errorInput : null]}
                    placeholder="Score (e.g., 85)"
                    keyboardType="numeric"
                    value={item.score}
                    onChangeText={(value) => handleInputChange(index, 'score', value)}
                  />
                  {courseErrors[index] ? (
                    <Text style={styles.error}>{courseErrors[index]}</Text>
                  ) : null}
                  <TextInput
                    style={[styles.input, courseErrors[index] ? styles.errorInput : null]}
                    placeholder="Credits (e.g., 3)"
                    keyboardType="numeric"
                    value={item.unit}
                    onChangeText={(value) => handleInputChange(index, 'unit', value)}
                  />
                  {courseErrors[index] ? (
                    <Text style={styles.error}>{courseErrors[index]}</Text>
                  ) : null}
                  <Text>
                    Grade: {item.grade} (Point: {item.gradePoint})
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            {isLoading ? (
              <ActivityIndicator size="large" color="#007BFF" />
            ) : (
              <>
                <TouchableOpacity onPress={calculateResult} style={styles.button}>
                  <Text style={styles.buttonText}>Calculate GPA</Text>
                </TouchableOpacity>
                {result !== null && (
                  <>
                    <Text>Your semester GPA is: {result}</Text>
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
    marginTop: 10,  // Ensure the container has some margin from the top
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
  courseContainer: {
    marginBottom: 20,
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

export default Gp;
