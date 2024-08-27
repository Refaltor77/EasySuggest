import {Head, Link} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {PageProps} from "@/types";
import {useState} from "react";

export default function Suggestions({auth, suggestions})
{
    interface User {
        name: string,
        email: string
    }
    interface Suggestion {
        title: string;
        description: string;
        user: User;
        id: number;
        vote_for_count: number;
        vote_no_count: number;
        user_id: number;
    }

    const [allSuggestions, setAllSuggestions] = useState<Suggestion[]>(suggestions);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Vos suggestions publiées</h2>}
        >
            <Head title="Vos suggestions"/>

            <div className="py-4">
                <div className="px-4">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className={"flex flex-col w-full gap-2 p-4"}>
                            {allSuggestions.map(suggestion => (
                                <article
                                    className={"p-4 border border-gray-300 rounded-lg flex justify-between items-center shadow-md"}>
                                    <div className={"flex flex-col w-2/3"}>
                                        <h1 className={"font-bold text-2xl text-gray-800"}>{suggestion.title} - {suggestion.user.name}</h1>
                                        <p className={"text-gray-600 mt-2"}>
                                            {suggestion.description}
                                        </p>
                                    </div>

                                    <div className={"flex flex-col items-center gap-4"}>
                                        <div className={"flex items-center gap-4"}>
                                            <div className={"flex items-center"}>
                                                <span className={"text-green-600 font-bold text-xl"}>+{suggestion.vote_for_count}</span>
                                                <button
                                                    className={"ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-700 transition"}>
                                                    👍
                                                </button>
                                            </div>
                                            <div className={"flex items-center"}>
                                                <span className={"text-red-600 font-bold text-xl"}>-{suggestion.vote_no_count}</span>
                                                <button
                                                    className={"ml-2 p-2 bg-red-500 text-white rounded hover:bg-red-700 transition"}>
                                                    👎
                                                </button>
                                            </div>
                                        </div>
                                        <div className={"flex items-center gap-2"}>
                                            <Link href={"/suggestions/" + suggestion.id}
                                                className={"p-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-800 transition"}>
                                                Voir
                                            </Link>
                                            {suggestion.user_id === auth.user.id ? (
                                                <Link
                                                    href={"/dashboard/suggestions/edit/" + suggestion.id}
                                                    className={"p-2 px-4 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-700 transition"}>
                                                    Modifier
                                                </Link>
                                            ) : ""}

                                            {suggestion.user_id === auth.user.id ? (
                                                <Link href={"/dashboard/suggestions/delete/" + suggestion.id}
                                                      className={"p-2 px-4 bg-red-500 text-white font-bold rounded hover:bg-red-700 transition"}>
                                                    Supprimer
                                                </Link>
                                            ) : ""}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
