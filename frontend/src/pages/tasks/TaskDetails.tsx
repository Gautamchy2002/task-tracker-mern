import { type FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosinstance from "@/api/axiosinstance";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage, getResponseData } from "@/lib/api-error";
import type { Task, TaskComment, TaskStatus } from "@/types";

const TaskDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchDetails = async () => {
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      const [taskResponse, commentsResponse] = await Promise.all([
        axiosinstance.get(`/tasks/${id}`),
        axiosinstance.get(`/tasks/${id}/comments`),
      ]);

      const taskData = getResponseData<{ task: Task }>(taskResponse.data);
      const commentsData = getResponseData<{ comments: TaskComment[] }>(
        commentsResponse.data,
      );

      setTask(taskData.task);
      setStatus(taskData.task.status);
      setComments(commentsData.comments || []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDetails();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!id) return;

    setSaving(true);
    setError("");

    try {
      await axiosinstance.put(`/tasks/${id}`, { status });
      await fetchDetails();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleComment = async (event: FormEvent) => {
    event.preventDefault();
    if (!id || !comment.trim()) return;

    setSaving(true);
    setError("");

    try {
      await axiosinstance.post(`/tasks/${id}/comments`, {
        content: comment.trim(),
      });
      setComment("");
      await fetchDetails();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading task details..." />;

  if (!task) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || "Task not found"}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Task Details"
        description="View task information and discussion."
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </p>
              <p className="mt-2 leading-7 text-slate-700">
                {task.description || "No description provided."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className="mt-2">{task.status}</Badge>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Priority</p>
                <p className="mt-2 font-semibold">{task.priority}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Created By</p>
                <p className="mt-2 font-semibold">
                  {task.createdBy?.name || "Unknown"}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Assigned To</p>
                <p className="mt-2 font-semibold">
                  {task.assignedTo?.name || "Unassigned"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <Label>Update Status</Label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <select
                  className="h-10 flex-1 rounded-md border bg-background px-3 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>

                <Button disabled={saving} onClick={() => void handleStatusUpdate()}>
                  Update Status
                </Button>
              </div>
              {user?.role === "MEMBER" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Members can update task status only.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {comments.map((item) => (
                <div key={item.id} className="rounded-lg border bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">
                      {item.author?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {item.content}
                  </p>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No comments yet.
                </p>
              )}
            </div>

            <form className="mt-5 space-y-3" onSubmit={handleComment}>
              <Textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <Button className="w-full" disabled={saving}>
                {saving ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskDetails;
