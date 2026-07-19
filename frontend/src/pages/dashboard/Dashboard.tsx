import { CheckCircle2, CircleDot, ClipboardList, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axiosinstance from "@/api/axiosinstance";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getApiErrorMessage, getResponseData } from "@/lib/api-error";
import type { Task } from "@/types";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosinstance.get("/tasks", {
          params: { page: 1, limit: 100 },
        });
        const data = getResponseData<{ tasks: Task[] }>(response.data);
        setTasks(data.tasks || []);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    void fetchTasks();
  }, []);

  const summary = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "TODO").length,
      progress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      done: tasks.filter((task) => task.status === "COMPLETED").length,
    }),
    [tasks],
  );

  if (loading) return <Loader label="Loading dashboard..." />;

  const cards = [
    { title: "Total Tasks", value: summary.total, icon: ClipboardList },
    { title: "To Do", value: summary.todo, icon: CircleDot },
    { title: "In Progress", value: summary.progress, icon: Timer },
    { title: "Completed", value: summary.done, icon: CheckCircle2 },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your workspace activity."
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="mt-2 text-3xl font-bold">{item.value}</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.slice(0, 5).map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{task.status}</Badge>
                  </TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.assignedTo?.name || "Unassigned"}</TableCell>
                </TableRow>
              ))}
              {tasks.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
