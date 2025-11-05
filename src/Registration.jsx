import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegistrationSchema = Yup.object().shape({
  fname: Yup.string().required('Required'),
  lname: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required'),
});

const Registration = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl px-8 py-10 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Registration
        </h2>

        <Formik
          initialValues={{ fname: '', lname: '', email: '', password: '' }}
          validationSchema={RegistrationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/register`,
                values
              );

              if (res.status === 200 || res.status === 201) {
                // alert('Account created successfully!');
                navigate('/login');
              } else {
                alert('Registration failed. Please try again.');
              }
            } catch (error) {
              console.error('Registration Error:', error);
              alert(
                error.response?.data?.message ||
                  'Something went wrong. Please try again later.'
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* First Name */}
              <div>
                <label htmlFor="fname" className="block text-gray-700 mb-1">
                  First Name
                </label>
                <Field
                  name="fname"
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="fname"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lname" className="block text-gray-700 mb-1">
                  Last Name
                </label>
                <Field
                  name="lname"
                  type="text"
                  placeholder="Enter your last name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="lname"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-gray-700 mb-1">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 rounded-md text-white font-semibold transition-colors duration-200 ${
                  isSubmitting
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>

        {/* Divider */}
        <div className="mt-6 border-t border-gray-200"></div>

        {/* Already have an account */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
