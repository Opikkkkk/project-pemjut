import { Link } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps, TaskIndexProps } from "@/types";

export default function Index({ auth, project, tasks }: PageProps<TaskIndexProps>) {
    return (
        <Authenticated header={<h2 className="text-xl font-bold">Tasks in {project.name}</h2>}>
            <Link href={route('projects.tasks.create', project.id)} className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded">
                + Create Task
            </Link>

            <div className="grid gap-4">
                {tasks.map(task => (
                    <Link
                        key={task.id}
                        href={route('projects.tasks.show', [project.id, task.id])}
                        className="block border rounded p-4 hover:bg-gray-100"
                    >
                        <div className="font-bold">{task.title}</div>
                        <div className="text-sm text-gray-600">{task.status}</div>
                    </Link>
                ))}
            </div>
        </Authenticated>
    );
}
