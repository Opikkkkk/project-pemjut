// resources/js/Pages/Tasks/Comments.tsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { PageProps, TaskCommentProps } from "@/types";
import { FormEvent } from "react";

export default function Comments({
    auth,
    task,
    comments,
}: PageProps<TaskCommentProps>) {
    const { data, setData, post, reset, processing, errors } = useForm({
        content: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route("projects.tasks.comments.store", [task.project_id, task.id]), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Task Comments</h2>}>
            <Head title="Task Comments" />

            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Task: {task.title}</h3>
                <p className="mb-4">{task.description}</p>

                <div className="mb-6">
                    <h4 className="font-medium">Comments</h4>
                    <div className="space-y-4 mt-2">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="border rounded p-3 bg-gray-50"
                                >
                                    <div className="text-sm text-gray-600">
                                        {comment.user.name} -{" "}
                                        {new Date(comment.created_at).toLocaleString()}
                                    </div>
                                    <div className="mt-1">{comment.content}</div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600">No comments yet.</p>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Add Comment</label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData("content", e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.content && (
                            <p className="text-red-500 text-sm">{errors.content}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Post Comment
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
