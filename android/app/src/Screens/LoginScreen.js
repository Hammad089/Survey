import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Image,} from 'react-native'
import React, { useState, useEffect } from 'react'
import FeatherIcon from 'react-native-vector-icons/Feather'
import * as yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from "react-native-toast-notifications";
const LoginSchema = yup.object().shape({
  email: yup.string().email('Please enter valid email').required('Email Address is required'),
  password: yup.string()
    .required('Password is required')
    .test(
      'minLength',
      'Password must be at least 6 characters long',
      (value) => value.length >= 6
    )
})

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const apiURL = 'https://coralr.com/api/login';
 
  useEffect(() => {
    checkPersistentLogin();
  }, []);

  const checkPersistentLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.replace('DashboardScreen');
      }
    } catch (error) {
      console.error('Error checking persistent login:', error.message);
    }
  };
  return (
    <>
      <Formik
         initialValues={{ email: '', password: '' }}
        validateOnMount={true}
        validationSchema={LoginSchema}
        onSubmit={async (values, { resetForm }) => {
          console.log(JSON.stringify(values));
         
          try {
            const result = await axios.post(apiURL, {
              email: values.email,
              password: values.password
            });

            if (result.data.status === 'success') {
              console.log('API response', result.data);
              const token = result.data.data.token;
              AsyncStorage.setItem('token', token);
              resetForm();
              navigation.replace('DashboardScreen');
            }
          } catch (error) {
            toast.show('Credentials do not match', {
              type: 'danger',
              placement: 'top',
              duration: 4000,
              offset: 30,
              animationType: 'slide-in',
            });
            console.log(error.message);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isValid }) => (
          <View style={styles.container}>
            <View style={styles.form}>
              <Image source={require('../Assests/coral-reef-01.png')} style={styles.LogoImage} />
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder='Email ID'
                placeholderTextColor="#000" 
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType='email-address'
              />
              {(errors.email && touched.email) &&
                <Text style={styles.errorText}>{errors.email}</Text>
              }
              <Text style={styles.label}>Password</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <TextInput
                  placeholder='Password'
                  placeholderTextColor="#000" 
                  secureTextEntry={showPassword}
                  style={styles.input}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                <TouchableOpacity>
                  <FeatherIcon name={showPassword ? 'eye-off' : 'eye'} size={20} style={styles.FeatherIcon} onPress={() => setShowPassword(!showPassword)} />
                </TouchableOpacity>
              </View>
              {(errors.password && touched.password) &&
                <Text style={styles.errorText}>{errors.password}</Text>
              }
              <Button title='Login' color='#1e76ba' onPress={handleSubmit} />
              <TouchableOpacity onPress={() => { }}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    marginTop: 40
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    color:'black',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5
  },
  LoginText: {
    fontSize: 30,
    marginBottom: 50,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  forgotPasswordText: {
    color: '#39b24a',
    fontWeight: '700',
    textAlign: 'right',
    marginTop: 20
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  },
  LogoImage: {
    width: 250,
    height: 60,
    marginBottom: 30,
    margin: 15,
  },
  FeatherIcon: {
    marginTop: 10,
    position: 'relative',
    right: 30
  }
})