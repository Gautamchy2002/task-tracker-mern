import { ErrorMessage, Field, Form, Formik } from "formik";
import { motion } from "framer-motion";
import { MoonLoader } from "react-spinners";
import * as Yup from "yup";
import axiosinstance from "@/api/axiosinstance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User, UserRole } from "@/types";

interface CreateUserProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getUsers: () => void;
  editData: User | null;
  setAlertMessage: (message: string) => void;
  setAlertType: (type: "success" | "error") => void;
  setAlertOpen: (open: boolean) => void;
}

const CreateUser: React.FC<CreateUserProps> = ({
  open,
  setOpen,
  getUsers,
  editData,
  setAlertMessage,
  setAlertType,
  setAlertOpen,
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent
      className="w-[92vw] max-w-2xl overflow-hidden p-0"
      onInteractOutside={(event) => event.preventDefault()}
    >
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
      >
        <DialogHeader className="border-b bg-gradient-to-r from-indigo-50 to-white px-6 py-5">
          <DialogTitle className="text-xl">
            {editData ? "Update User Role" : "Add New User"}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? "Change the selected user's tenant role."
              : "Create a manager or member for the current tenant."}
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{
            name: editData?.name || "",
            email: editData?.email || "",
            password: "",
            role: (editData?.role === "ADMIN"
              ? "MANAGER"
              : editData?.role || "MEMBER") as UserRole,
          }}
          enableReinitialize
          validationSchema={Yup.object({
            name: editData
              ? Yup.string()
              : Yup.string().trim().min(2).max(100).required("Name is required"),
            email: editData
              ? Yup.string()
              : Yup.string().email().required("Email is required"),
            password: editData
              ? Yup.string()
              : Yup.string()
                  .min(8, "Password must be at least 8 characters")
                  .matches(/[A-Za-z]/, "At least one letter is required")
                  .matches(/[0-9]/, "At least one number is required")
                  .matches(
                    /[^A-Za-z0-9]/,
                    "At least one special character is required",
                  )
                  .required("Password is required"),
            role: Yup.string().required("Role is required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if (editData) {
                await axiosinstance.put(`/users/${editData.id}/role`, {
                  role: values.role,
                });
                setAlertMessage("User role updated successfully!");
              } else {
                await axiosinstance.post("/users", values);
                setAlertMessage("User created successfully!");
              }

              setAlertType("success");
              setAlertOpen(true);
              setOpen(false);
              getUsers();
            } catch (error: any) {
              setAlertMessage(
                error?.response?.data?.message || "Something went wrong!",
              );
              setAlertType("error");
              setAlertOpen(true);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-5 px-6 py-5">
              {!editData && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as={Input}
                      name="name"
                      placeholder="Enter full name"
                      className="mt-2 bg-slate-50"
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      className="mt-2 bg-slate-50"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as={Input}
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      className="mt-2 bg-slate-50"
                    />
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">
                  Role <span className="text-red-500">*</span>
                </label>
                <Select
                  value={values.role}
                  onValueChange={(value) => setFieldValue("role", value)}
                >
                  <SelectTrigger className="mt-2 bg-slate-50">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <MoonLoader size={17} color="#fff" />
                  ) : editData ? (
                    "Update Role"
                  ) : (
                    "Add User"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </DialogContent>
  </Dialog>
);

export default CreateUser;
