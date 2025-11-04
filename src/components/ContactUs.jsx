import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  message: Yup.string().required("Message is required"),
});

const ContactUs = () => {
  return (
    <div
      className="p-8 bg-white rounded mt-10"
      id="contact"
    >
      <div className=" max-w-6xl mx-auto shadow-md p-8"> 
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Contact Us</h2>
        <Formik
          initialValues={{ name: "", email: "", message: "" }}
          validationSchema={ContactSchema}
          onSubmit={(values, { resetForm }) => {
            alert("Thank you for contacting us!");
            resetForm();
          }}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium mb-1">
                  Name
                </label>
                <Field
                  name="name"
                  type="text"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-medium mb-1">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="message" className="block font-medium mb-1">
                  Message
                </label>
                <Field
                  name="message"
                  as="textarea"
                  rows="4"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Send
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ContactUs;
