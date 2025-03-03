import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";

export default function FormPage() {
    const schema = yup.object({
        email: yup.string().email().required(),
    });

    return (
        <div className="col-12 h-100 d-flex align-items-center justify-content-center">
            <Formik
                initialValues={{ email: "" }}
                validationSchema={schema}
                onSubmit={console.log}
            >
                {() => (
                    <Form className="bg-white rounded shadow border col-10 col-md-5 d-flex flex-column gap-2 p-3">
                        <Field className="form-control" name="email" placeholder="Email" />
                        <ErrorMessage className="text-danger" name="email" component="span" />
                        <button className="btn btn-primary" type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}
