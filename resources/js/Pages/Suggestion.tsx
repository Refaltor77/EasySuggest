import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import {Link, useForm} from "@inertiajs/react";
import {Button, Grid, Paper, TextField} from "@mui/material";
import {FormEventHandler, useState} from "react";

export default function Suggestion({auth, suggestion, hasVoted})
{
    const { data, setData, post, processing, errors, reset } = useForm({
        content: ''
    });

    const [create, setCreate] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/reviews/create/' + suggestion.id, {
            onFinish: (data) => {
                setCreate(true);
                reset('content');
            },
        });
    };

    function timeAgo(isoDate) {
        const reviewDate = new Date(isoDate);
        const currentDate = new Date();
        // @ts-ignore
        const secondsAgo = Math.floor((currentDate - reviewDate) / 1000);

        if (secondsAgo < 60) {
            return secondsAgo === 1 ? 'il y a 1 seconde' : `il y a ${secondsAgo} secondes`;
        }

        const minutesAgo = Math.floor(secondsAgo / 60);
        if (minutesAgo < 60) {
            return minutesAgo === 1 ? 'il y a 1 minute' : `il y a ${minutesAgo} minutes`;
        }

        const hoursAgo = Math.floor(minutesAgo / 60);
        if (hoursAgo < 24) {
            return hoursAgo === 1 ? 'il y a 1 heure' : `il y a ${hoursAgo} heures`;
        }

        const daysAgo = Math.floor(hoursAgo / 24);
        if (daysAgo < 30) {
            return daysAgo === 1 ? 'il y a 1 jour' : `il y a ${daysAgo} jours`;
        }

        const monthsAgo = Math.floor(daysAgo / 30);
        if (monthsAgo < 12) {
            return monthsAgo === 1 ? 'il y a 1 mois' : `il y a ${monthsAgo} mois`;
        }

        const yearsAgo = Math.floor(monthsAgo / 12);
        return yearsAgo === 1 ? 'il y a 1 an' : `il y a ${yearsAgo} ans`;
    }


    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" >
                    <Toolbar className={"shadow-xl"}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            <Link href={"/"}>EasySuggest</Link>
                        </Typography>
                        {auth.user ? (
                            <div className={"flex items-center gap-4"}>
                                <Link href={"/dashboard"}
                                    className={"p-1 px-2 bg-blue-700 font-bold shadow rounded hover:bg-blue-950 transition"}>
                                    {auth.user.name}
                                </Link>
                                <Link href={"/dashboard/suggestions/create"}
                                    className={"p-1 px-2 bg-blue-700 font-bold shadow rounded hover:bg-blue-950 transition"}>
                                    Créer une suggestion
                                </Link>
                            </div>
                        ) : (
                            <div className={"flex items-center gap-4"}>
                                <Link href={"/login"}
                                    className={"p-1 px-2 bg-blue-700 font-bold shadow rounded hover:bg-blue-950 transition"}>
                                    Connexion
                                </Link>
                                <Link href={"/register"}
                                    className={"p-1 px-2 bg-blue-700 font-bold shadow rounded hover:bg-blue-950 transition"}>
                                    inscription
                                </Link>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
            <Box className={"bg-gray-200 h-screen flex flex-col w-full gap-4 p-6"}>
                {hasVoted ? (
                    <div className={"border border-red-600 text-red-600 font-bold p-4 rounded shadow bg-white"}>
                        <p>Vous avez déjà voté</p>
                    </div>
                ) : ""}
                <div className={"bg-white p-6 shadow-md rounded-lg"}>
                    <div className={"flex items-center justify-between"}>
                        <h1 className={"font-bold text-2xl mb-4"}>{suggestion.title} - {suggestion.user.name}</h1>
                        <p>{timeAgo(suggestion.created_at)}</p>
                    </div>
                    <p className={"text-gray-700 mb-6"}>
                        {suggestion.description}
                    </p>
                    <div className={"flex items-center gap-6"}>
                        <div className={"flex items-center"}>
                            <span className={"text-green-600 font-bold text-xl"}>+{suggestion.vote_for_count}</span>
                            <Link href={"/suggestions/vote/yes/" + suggestion.id}
                                  className={"ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-700 transition"}>
                                👍
                            </Link>
                        </div>
                        <div className={"flex items-center"}>
                            <span className={"text-red-600 font-bold text-xl"}>-{suggestion.vote_no_count}</span>
                            <Link href={"/suggestions/vote/no/" + suggestion.id}
                                  className={"ml-2 p-2 bg-red-500 text-white rounded hover:bg-red-700 transition"}>
                                👎
                            </Link>
                        </div>
                    </div>
                    {suggestion.user_id === auth.user.id ? (
                        <div className={"flex items-center gap-4 mt-6"}>
                            <Link href={"/dashboard/suggestions/edit/" + suggestion.id}
                                  className={"p-2 px-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-800 transition"}>
                                Modifier
                            </Link>
                            <Link href={"/dashboard/suggestions/delete/" + suggestion.id}
                                  className={"p-2 px-4 bg-red-500 text-white font-bold rounded hover:bg-red-700 transition"}>
                                Supprimer
                            </Link>
                        </div>
                    ) : ""}
                </div>
                <div className={"bg-white p-6 shadow-md rounded-lg mt-4"}>
                    <h2 className={"font-bold text-xl mb-4"}>Commentaires</h2>
                    {create ? (
                        <div className={"text-green-600 border border-green-600 p-2 rounded mb-4"}>
                            <p>Votre commentaire est posté !</p>
                        </div>

                    ) : ""}
                    <form onSubmit={submit} className={"mb-6"}>
                        <TextField
                            label="Ajouter un commentaire"
                            fullWidth
                            multiline
                            rows={3}
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                        />
                        <Button type={"submit"} className={"bg-blue-600 text-white hover:bg-blue-800"}
                                variant="contained">Poster</Button>
                    </form>
                    <div className={"flex flex-col gap-4"}>
                    {suggestion.reviews.map(review => (
                            <div className={"bg-gray-100 p-4 rounded-lg shadow"}>
                                <div className={"flex justify-between items-center"}>
                                    <p className={"font-semibold text-gray-800"}>{review.user.name}</p>
                                    <p>{timeAgo(review.created_at)}</p>
                                </div>
                                <p className={"text-gray-600"}>{review.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Box>
        </>
    );
}
