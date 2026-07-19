// import { ErrorMessage, Field, Form, Formik } from "formik";
// import { motion } from "framer-motion";
// import { MoonLoader } from "react-spinners";
// import * as Yup from "yup";
// import axiosinstance from "@/api/axiosinstance";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import type { Task, TaskPriority, TaskStatus, User } from "@/types";

// interface CreateTaskProps {
//   open: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   getTasks: () => void;
//   editData: Task | null;
//   members: User[];
//   setAlertMessage: (message: string) => void;
//   setAlertType: (type: "success" | "error") => void;
//   setAlertOpen: (open: boolean) => void;
// }

// const CreateTask: React.FC<CreateTaskProps> = ({
//   open,
//   setOpen,
//   getTasks,
//   editData,
//   members,
//   setAlertMessage,
//   setAlertType,
//   setAlertOpen,
// }) => {
//   const initialValues = {
//     title: editData?.title || "",
//     description: editData?.description || "",
//     status: (editData?.status || "TODO") as TaskStatus,
//     priority: (editData?.priority || "MEDIUM") as TaskPriority,
//     dueDate: editData?.dueDate
//       ? new Date(editData.dueDate).toISOString().split("T")[0]
//       : "",
//     assignedToId: editData?.assignedToId || "",
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent
//         className="w-[92vw] max-w-3xl overflow-hidden p-0"
//         onInteractOutside={(event) => event.preventDefault()}
//       >
//         <motion.div
//           initial={{ y: -40, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ type: "spring", stiffness: 120, damping: 16 }}
//         >
//           <DialogHeader className="border-b bg-gradient-to-r from-indigo-50 to-white px-6 py-5">
//             <DialogTitle className="text-xl">
//               {editData ? "Edit Task" : "Add New Task"}
//             </DialogTitle>
//             <DialogDescription>
//               {editData
//                 ? "Update task information and assignment."
//                 : "Create a task and optionally assign it to a member."}
//             </DialogDescription>
//           </DialogHeader>

//           <Formik
//             initialValues={initialValues}
//             enableReinitialize
//             validationSchema={Yup.object({
//               title: Yup.string()
//                 .trim()
//                 .min(3, "Title must be at least 3 characters")
//                 .max(150, "Title cannot exceed 150 characters")
//                 .required("Title is required"),
//               description: Yup.string()
//                 .trim()
//                 .max(1000, "Description cannot exceed 1000 characters"),
//               status: Yup.string().required("Status is required"),
//               priority: Yup.string().required("Priority is required"),
//             })}
//             onSubmit={async (values, { setSubmitting }) => {
//               try {
//                 const payload = {
//                   title: values.title.trim(),
//                   description: values.description.trim() || undefined,
//                   status: values.status,
//                   priority: values.priority,
//                   dueDate: values.dueDate
//                     ? new Date(`${values.dueDate}T00:00:00`).toISOString()
//                     : undefined,
//                   assignedToId: values.assignedToId || undefined,
//                 };

//                 if (editData) {
//                   await axiosinstance.put(`/tasks/${editData.id}`, payload);
//                   setAlertMessage("Task has been successfully updated!");
//                 } else {
//                   await axiosinstance.post("/tasks", payload);
//                   setAlertMessage("Task has been successfully created!");
//                 }

//                 setAlertType("success");
//                 setAlertOpen(true);
//                 setOpen(false);
//                 getTasks();
//               } catch (error: any) {
//                 setAlertMessage(
//                   error?.response?.data?.message || "Something went wrong!",
//                 );
//                 setAlertType("error");
//                 setAlertOpen(true);
//               } finally {
//                 setSubmitting(false);
//               }
//             }}
//           >
//             {({ isSubmitting, values, setFieldValue }) => (
//               <Form className="space-y-5 px-6 py-5">
//                 <div className="grid gap-5 md:grid-cols-2">
//                   <div className="md:col-span-2">
//                     <label className="text-sm font-medium">
//                       Task Title <span className="text-red-500">*</span>
//                     </label>
//                     <Field
//                       as={Input}
//                       name="title"
//                       placeholder="Enter task title"
//                       className="mt-2 bg-slate-50"
//                     />
//                     <ErrorMessage
//                       name="title"
//                       component="p"
//                       className="mt-1 text-xs text-red-500"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="text-sm font-medium">Description</label>
//                     <Field
//                       as="textarea"
//                       name="description"
//                       rows={4}
//                       placeholder="Enter task description"
//                       className="mt-2 flex w-full rounded-md border bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
//                     />
//                     <ErrorMessage
//                       name="description"
//                       component="p"
//                       className="mt-1 text-xs text-red-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">
//                       Status <span className="text-red-500">*</span>
//                     </label>
//                     <Select
//                       value={values.status}
//                       onValueChange={(value) => setFieldValue("status", value)}
//                     >
//                       <SelectTrigger className="mt-2 bg-slate-50">
//                         <SelectValue placeholder="Select status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="TODO">To Do</SelectItem>
//                         <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
//                         <SelectItem value="COMPLETED">Completed</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <ErrorMessage
//                       name="status"
//                       component="p"
//                       className="mt-1 text-xs text-red-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">
//                       Priority <span className="text-red-500">*</span>
//                     </label>
//                     <Select
//                       value={values.priority}
//                       onValueChange={(value) => setFieldValue("priority", value)}
//                     >
//                       <SelectTrigger className="mt-2 bg-slate-50">
//                         <SelectValue placeholder="Select priority" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="LOW">Low</SelectItem>
//                         <SelectItem value="MEDIUM">Medium</SelectItem>
//                         <SelectItem value="HIGH">High</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">Due Date</label>
//                     <Field
//                       as={Input}
//                       type="date"
//                       name="dueDate"
//                       className="mt-2 bg-slate-50"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-sm font-medium">Assign Member</label>
//                     <Select
//                       value={values.assignedToId || "unassigned"}
//                       onValueChange={(value) =>
//                         setFieldValue(
//                           "assignedToId",
//                           value === "unassigned" ? "" : value,
//                         )
//                       }
//                     >
//                       <SelectTrigger className="mt-2 bg-slate-50">
//                         <SelectValue placeholder="Select member" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="unassigned">Unassigned</SelectItem>
//                         {members.map((member) => (
//                           <SelectItem key={member.id} value={member.id}>
//                             {member.name} ({member.email})
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-3 border-t pt-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? (
//                       <MoonLoader size={17} color="#fff" />
//                     ) : editData ? (
//                       "Update Task"
//                     ) : (
//                       "Add Task"
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </motion.div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreateTask;

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
        className="
          flex
          max-h-[94dvh]
          w-[calc(100vw-24px)]
          max-w-3xl
          flex-col
          gap-0
          overflow-hidden
          rounded-xl
          p-0
          sm:w-[92vw]
          sm:rounded-2xl
        "
        onInteractOutside={(event) => event.preventDefault()}
      >
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 16,
          }}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <DialogHeader
            className="
              shrink-0
              border-b
              bg-gradient-to-r
              from-indigo-50
              to-white
              px-4
              py-4
              pr-12
              text-left
              sm:px-6
              sm:py-5
            "
          >
            <DialogTitle className="text-lg leading-6 sm:text-xl">
              {editData ? "Edit Task" : "Add New Task"}
            </DialogTitle>

            <DialogDescription className="text-xs leading-5 sm:text-sm">
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
              <Form className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div
                  className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    overscroll-contain
                    px-4
                    py-4
                    sm:px-6
                    sm:py-5
                  "
                >
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="min-w-0 md:col-span-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Task Title <span className="text-red-500">*</span>
                      </label>

                      <Field
                        as={Input}
                        id="title"
                        name="title"
                        placeholder="Enter task title"
                        className="mt-2 h-10 w-full bg-slate-50"
                      />

                      <ErrorMessage
                        name="title"
                        component="p"
                        className="mt-1 text-xs leading-4 text-red-500"
                      />
                    </div>

                    <div className="min-w-0 md:col-span-2">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description
                      </label>

                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Enter task description"
                        className="
                          mt-2
                          min-h-24
                          w-full
                          resize-y
                          rounded-md
                          border
                          border-input
                          bg-slate-50
                          px-3
                          py-2
                          text-sm
                          outline-none
                          placeholder:text-muted-foreground
                          focus-visible:ring-2
                          focus-visible:ring-ring
                          focus-visible:ring-offset-2
                        "
                      />

                      <ErrorMessage
                        name="description"
                        component="p"
                        className="mt-1 text-xs leading-4 text-red-500"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="text-sm font-medium">
                        Status <span className="text-red-500">*</span>
                      </label>

                      <Select
                        value={values.status}
                        onValueChange={(value: TaskStatus) =>
                          setFieldValue("status", value)
                        }
                      >
                        <SelectTrigger className="mt-2 h-10 w-full bg-slate-50">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="TODO">To Do</SelectItem>
                          <SelectItem value="IN_PROGRESS">
                            In Progress
                          </SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>

                      <ErrorMessage
                        name="status"
                        component="p"
                        className="mt-1 text-xs leading-4 text-red-500"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="text-sm font-medium">
                        Priority <span className="text-red-500">*</span>
                      </label>

                      <Select
                        value={values.priority}
                        onValueChange={(value: TaskPriority) =>
                          setFieldValue("priority", value)
                        }
                      >
                        <SelectTrigger className="mt-2 h-10 w-full bg-slate-50">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                        </SelectContent>
                      </Select>

                      <ErrorMessage
                        name="priority"
                        component="p"
                        className="mt-1 text-xs leading-4 text-red-500"
                      />
                    </div>

                    <div className="min-w-0">
                      <label htmlFor="dueDate" className="text-sm font-medium">
                        Due Date
                      </label>

                      <Field
                        as={Input}
                        id="dueDate"
                        type="date"
                        name="dueDate"
                        className="mt-2 h-10 w-full bg-slate-50"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="text-sm font-medium">
                        Assign Member
                      </label>

                      <Select
                        value={values.assignedToId || "unassigned"}
                        onValueChange={(value) =>
                          setFieldValue(
                            "assignedToId",
                            value === "unassigned" ? "" : value,
                          )
                        }
                      >
                        <SelectTrigger className="mt-2 h-10 w-full min-w-0 bg-slate-50">
                          <SelectValue placeholder="Select member" />
                        </SelectTrigger>

                        <SelectContent className="max-w-[calc(100vw-32px)]">
                          <SelectItem value="unassigned">Unassigned</SelectItem>

                          {members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <span className="block max-w-[260px] truncate sm:max-w-md">
                                {member.name} ({member.email})
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div
                  className="
                    shrink-0
                    border-t
                    bg-background
                    px-4
                    py-4
                    shadow-[0_-4px_12px_rgba(15,23,42,0.06)]
                    sm:px-6
                  "
                >
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 w-full sm:w-auto sm:min-w-24"
                      disabled={isSubmitting}
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      className="h-10 w-full sm:w-auto sm:min-w-28"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <MoonLoader size={16} color="#ffffff" />

                          <span>{editData ? "Updating..." : "Adding..."}</span>
                        </span>
                      ) : editData ? (
                        "Update Task"
                      ) : (
                        "Add Task"
                      )}
                    </Button>
                  </div>
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
