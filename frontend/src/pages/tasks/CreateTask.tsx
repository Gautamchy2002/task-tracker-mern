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
import type { Task, TaskPriority, TaskStatus, User } from "@/types";

interface CreateTaskProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getTasks: () => void;
  editData: Task | null;
  members: User[];
  setAlertMessage: (message: string) => void;
  setAlertType: (type: "success" | "error") => void;
  setAlertOpen: (open: boolean) => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({
  open,
  setOpen,
  getTasks,
  editData,
  members,
  setAlertMessage,
  setAlertType,
  setAlertOpen,
}) => {
  const initialValues = {
    title: editData?.title || "",
    description: editData?.description || "",
    status: (editData?.status || "TODO") as TaskStatus,
    priority: (editData?.priority || "MEDIUM") as TaskPriority,
    dueDate: editData?.dueDate
      ? new Date(editData.dueDate).toISOString().split("T")[0]
      : "",
    assignedToId: editData?.assignedToId || "",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-[92vw] max-w-3xl overflow-hidden p-0"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        >
          <DialogHeader className="border-b bg-gradient-to-r from-indigo-50 to-white px-6 py-5">
            <DialogTitle className="text-xl">
              {editData ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <DialogDescription>
              {editData
                ? "Update task information and assignment."
                : "Create a task and optionally assign it to a member."}
            </DialogDescription>
          </DialogHeader>

          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={Yup.object({
              title: Yup.string()
                .trim()
                .min(3, "Title must be at least 3 characters")
                .max(150, "Title cannot exceed 150 characters")
                .required("Title is required"),
              description: Yup.string()
                .trim()
                .max(1000, "Description cannot exceed 1000 characters"),
              status: Yup.string().required("Status is required"),
              priority: Yup.string().required("Priority is required"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const payload = {
                  title: values.title.trim(),
                  description: values.description.trim() || undefined,
                  status: values.status,
                  priority: values.priority,
                  dueDate: values.dueDate
                    ? new Date(`${values.dueDate}T00:00:00`).toISOString()
                    : undefined,
                  assignedToId: values.assignedToId || undefined,
                };

                if (editData) {
                  await axiosinstance.put(`/tasks/${editData.id}`, payload);
                  setAlertMessage("Task has been successfully updated!");
                } else {
                  await axiosinstance.post("/tasks", payload);
                  setAlertMessage("Task has been successfully created!");
                }

                setAlertType("success");
                setAlertOpen(true);
                setOpen(false);
                getTasks();
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
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as={Input}
                      name="title"
                      placeholder="Enter task title"
                      className="mt-2 bg-slate-50"
                    />
                    <ErrorMessage
                      name="title"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      rows={4}
                      placeholder="Enter task description"
                      className="mt-2 flex w-full rounded-md border bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={values.status}
                      onValueChange={(value) => setFieldValue("status", value)}
                    >
                      <SelectTrigger className="mt-2 bg-slate-50">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TODO">To Do</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="status"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={values.priority}
                      onValueChange={(value) => setFieldValue("priority", value)}
                    >
                      <SelectTrigger className="mt-2 bg-slate-50">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <Field
                      as={Input}
                      type="date"
                      name="dueDate"
                      className="mt-2 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Assign Member</label>
                    <Select
                      value={values.assignedToId || "unassigned"}
                      onValueChange={(value) =>
                        setFieldValue(
                          "assignedToId",
                          value === "unassigned" ? "" : value,
                        )
                      }
                    >
                      <SelectTrigger className="mt-2 bg-slate-50">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} ({member.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                      "Update Task"
                    ) : (
                      "Add Task"
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
};

export default CreateTask;
