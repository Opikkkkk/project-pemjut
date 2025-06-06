import { FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps, TaskFormProps } from "@/types";

export default function Create({ auth, project_id, team_members }: PageProps<TaskFormProps>) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        status: "todo",
        assigned_user_ids: [] as number[],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route("projects.tasks.store", project_id));
    };

    return (
        <Authenticated header={<h2 className="text-xl font-bold">Create Task</h2>}>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                <div>
                    <label className="block mb-1">Title</label>
                    <input type="text" className="w-full border rounded p-2" value={data.title} onChange={e => setData("title", e.target.value)} />
                    {errors.title && <div className="text-red-500">{errors.title}</div>}
                </div>
                <div>
                    <label className="block mb-1">Description</label>
                    <textarea className="w-full border rounded p-2" rows={4} value={data.description} onChange={e => setData("description", e.target.value)} />
                    {errors.description && <div className="text-red-500">{errors.description}</div>}
                </div>
                <div>
                    <label className="block mb-1">Status</label>
                    <select className="w-full border rounded p-2" value={data.status} onChange={e => setData("status", e.target.value as any)}>
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1">Assign To</label>
                    <select
                        multiple
                        className="w-full border rounded p-2"
                        value={data.assigned_user_ids.map(String)}
                        onChange={e => setData("assigned_user_ids", Array.from(e.target.selectedOptions).map(opt => parseInt(opt.value)))}
                    >
                        {team_members.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={processing}>Save</button>
            </form>
        </Authenticated>
    );
}
