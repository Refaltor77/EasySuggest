import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import {Link} from "@inertiajs/react";
import {Grid, Paper} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Welcome({auth, suggestions})
{
    const [allSuggestions, setAllSuggestions] = useState(suggestions);


    useEffect(() => {
        // Fonction pour récupérer les suggestions
        const fetchSuggestions = async () => {
            try {
                const response = await axios.get('/api/suggestions');
                setAllSuggestions(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des suggestions:', error);
            }
        };

        // Charger les suggestions immédiatement au montage
        fetchSuggestions();

        // Créer l'intervalle pour recharger les suggestions toutes les 5 secondes
        const interval = setInterval(() => {
            fetchSuggestions();
        }, 5000); // 5000ms = 5 secondes

        // Nettoyer l'intervalle lors du démontage du composant
        return () => clearInterval(interval);
    }, []);

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
            <Box className={"bg-gray-200 flex flex-col w-full gap-2 p-4 min-h-screen"}>
                {allSuggestions.map((suggestion) => (
                    <article
                        className={"p-4 border border-gray-300 rounded-lg flex justify-between items-center shadow-md"}>
                        <div className={"flex flex-col w-2/3"}>
                            <p>{timeAgo(suggestion.created_at)} par {suggestion.user.name}</p>
                            <div className={"flex items-center justify-between"}>
                                <h1 className={"font-bold text-2xl text-gray-800"}>{suggestion.title}</h1>
                            </div>
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
                                {auth.user ? (
                                    suggestion.user_id === auth.user.id ? (
                                            <Link
                                                href={"/dashboard/suggestions/edit/" + suggestion.id}
                                                className={"p-2 px-4 bg-yellow-500 text-white font-bold rounded hover:bg-yellow-700 transition"}>
                                                Modifier
                                            </Link>
                                        ) : ""
                                ) : ""}
                            </div>
                        </div>
                    </article>
                ))}
            </Box>
        </>
    );
}
