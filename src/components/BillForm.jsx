import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string().required("Required"),
  billNumber: Yup.string().required("Required"),
  date: Yup.string().required("Required"),
  businessDetails: Yup.object({
    name: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    representative: Yup.string().required("Required"),
  }),
  clientDetails: Yup.object({
    phone: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    name: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
  }),
  products: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Required"),
      sku: Yup.string().required("Required"),
      quantity: Yup.number().min(1, "Min 1").required("Required"),
      unitPrice: Yup.number().min(0, "Min 0").required("Required"),
    })
  ),
});

const initialValues = {
  title: "Bill",
  billNumber: "BILL-" + Date.now(),
  date: "",
  businessDetails: { name: "", address: "", city: "", representative: "" },
  clientDetails: { phone: "", email: "", name: "", address: "" },
  products: [{ name: "", sku: "", quantity: 1, unitPrice: 0 }],
  total: 0
};

export default function BillForm({ onSubmit }) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmit(values, values.products.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      ) === 0 ? (
        0
      ) : (
        values.products
            .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
            .toFixed(2)
      ))}
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-6">
          {/* Invoice Info */}
          <div>
            <h3 className="font-medium mb-2">Bill Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Title</label>
                <Field name="title" placeholder="Title" className="input" />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Invoice Number</label>
                <Field
                  name="billNumber"
                  placeholder="Invoice Number"
                  className="input cursor-not-allowed bg-gray-100"
                  disabled
                />
                <ErrorMessage
                  name="billNumber"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Date</label>
                <Field name="date" type="date" className="input" />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div>
            <h3 className="font-medium mb-2">Business Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {["name", "address", "city", "representative"].map((field) => (
                <div key={field}>
                  <Field
                    name={`businessDetails.${field}`}
                    placeholder={field[0].toUpperCase() + field.slice(1)}
                    className="input"
                  />
                  <ErrorMessage
                    name={`businessDetails.${field}`}
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Client Details */}
          <div>
            <h3 className="font-medium mb-2">Client Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {["name", "phone", "email", "address"].map((field) => (
                <div key={field}>
                  <Field
                    name={`clientDetails.${field}`}
                    placeholder={
                      field === "phone"
                        ? "Phone"
                        : field[0].toUpperCase() + field.slice(1)
                    }
                    className="input"
                  />
                  <ErrorMessage
                    name={`clientDetails.${field}`}
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-medium mb-2">Products</h3>
            <FieldArray name="products">
              {({ remove, push }) => (
                <div className="space-y-4">
                  {values.products.map((val, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 gap-3 items-start"
                    >
                      <div>
                        <Field
                          name={`products.${index}.name`}
                          placeholder="Product Name"
                          className="input"
                        />
                        <ErrorMessage
                          name={`products.${index}.name`}
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Field
                          name={`products.${index}.sku`}
                          placeholder="SKU"
                          className="input"
                        />
                        <ErrorMessage
                          name={`products.${index}.sku`}
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Field
                          name={`products.${index}.quantity`}
                          type="number"
                          placeholder="Qty"
                          className="input"
                        />
                        <ErrorMessage
                          name={`products.${index}.quantity`}
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Field
                          name={`products.${index}.unitPrice`}
                          type="number"
                          placeholder="Unit Price"
                          className="input"
                        />
                        <ErrorMessage
                          name={`products.${index}.unitPrice`}
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      </div>
                      <div>
                        <Field
                          value={val.quantity * val.unitPrice}
                          disabled
                          placeholder="Total"
                          className="input"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 mt-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      push({ name: "", sku: "", quantity: 1, unitPrice: 0 })
                    }
                    className="rounded-md border px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    + Add Product
                  </button>
                </div>
              )}
            </FieldArray>
          </div>

          <div className="flex justify-end mt-4">
            {values.products.reduce(
              (sum, item) => sum + item.quantity * item.unitPrice,
              0
            ) === 0 ? (
              <span className="text-gray-700 font-medium">
                No items added.
              </span>
            ) : (
              <span className="text-gray-800 font-semibold text-lg">
                Grand Total: ₹
                {values.products
                  .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                  .toFixed(2)}
              </span>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save Invoice
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
