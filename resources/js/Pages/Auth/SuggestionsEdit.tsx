import {Head, Link, useForm} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {PageProps} from "@/types";
import {FormEventHandler, useState} from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Checkbox from "@/Components/Checkbox";
import PrimaryButton from "@/Components/PrimaryButton";
import {Textarea} from "@headlessui/react";
import GuestLayout from '@/Layouts/GuestLayout';
import {Alert} from "@mui/material";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;
import {data} from "autoprefixer";

export default function SuggestionsEdit({auth, suggestion}: PageProps)
{
    const { data, setData, post, processing, errors, reset } = useForm({
        title: suggestion.title,
        content: suggestion.description
    });

    const [create, setCreate] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/dashboard/suggestions/update/' + suggestion.id, {
            onFinish: (data) => {
                setCreate(true);
                console.log(data);
            },
        });
    };



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Update d'une suggestion</h2>}
        >
            <Head title="Update d'une suggestion"/>
            <div className={"p-20"}>
                <div className={"bg-white mb-4 border rounded border-green-700"}>
                    {create ? (
                        <div className={"text-green-700 p-4"}>
                            <h1 className={"font-bold text-lg"}>Votre suggestion à bien été update !</h1>
                            <Link href={""}></Link>
                        </div>
                    ) : ("")}
                </div>
                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="title" value="Titre"/>

                        <TextInput
                            id="title"
                            type="text"
                            name="title"
                            value={data.title}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) => setData('title', e.target.value)}
                        />

                        <InputError message={errors.title} className="mt-2"/>
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="content" value="Suggestion"/>

                        <Textarea
                            id="content"
                            name="content"
                            value={data.content}
                            className="mt-1 block w-full rounded border-gray-300"
                            rows={10}
                            onChange={(e) => setData('content', e.target.value)}

                        />

                        <InputError message={errors.content} className="mt-2"/>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                        <PrimaryButton className="ms-4" disabled={processing}>
                            Update
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
