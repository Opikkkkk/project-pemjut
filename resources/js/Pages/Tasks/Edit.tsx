// resources/js/Pages/Tasks/Edit.tsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { PageProps, TaskFormProps } from "@/types";
import { FormEvent } from "react";

export default function Edit({
    auth,
    errors,
    project_id,
    task,
    team_members,
}: PageProps<TaskFormProps>) {
    const { data, setData, put, processing } = useForm({
        title: task?.title || "",
        description: task?.description || "",
        status: task?.status || "todo",
        assigned_users: task?.assigned_users.map((user) => user.id) || [],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route("projects.tasks.update", [project_id, task?.id]));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Edit Task</h2>}>
            <Head title="Edit Task" />

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                    <label className="block font-medium">Title</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                <div>
                    <label className="block font-medium">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div>
                    <label className="block font-medium">Status</label>
                    <select
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value as "todo" | "in_progress" | "done")}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                </div>

                <div>
                    <label className="block font-medium">Assigned Team Members</label>
                    <div className="grid grid-cols-2 gap-2">
                        {team_members.map((member) => (
                            <label key={member.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={member.id}
                                    checked={data.assigned_users.includes(member.id)}
                                    onChange={(e) => {
                                        const id = Number(e.target.value);
                                        setData("assigned_users", e.target.checked
                                            ? [...data.assigned_users, id]
                                            : data.assigned_users.filter((uid) => uid !== id));
                                    }}
                                />
                                {member.name} ({member.role})
                            </label>
                        ))}
                    </div>
                    {errors.assigned_users && (
                        <p className="text-red-500 text-sm">{errors.assigned_users}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Update Task
                </button>

                <Link
                    href={route("projects.tasks.index", project_id)}
                    className="ml-4 text-gray-600 hover:underline"
                >
                    Cancel
                </Link>
            </form>
        </AuthenticatedLayout>
    );
}
