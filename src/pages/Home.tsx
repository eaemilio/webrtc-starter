import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirestore } from 'reactfire';
import { RaceBy } from '@uiball/loaders';

function Home(): JSX.Element {
    const navigate = useNavigate();
    const firestore = useFirestore();
    const rooms = collection(firestore, 'rooms');

    const [isLoading, setIsLoading] = useState(false);
    const [roomId, setRoomId] = useState('');

    const createRoom = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const docRef = await addDoc(rooms, {});
            const id = docRef.id;

            await setDoc(doc(firestore, 'offerCandidates', id), {});
            await setDoc(doc(firestore, 'answerCandidates', id), {});
            navigate(`/rooms/${id}`, { state: { isHost: true } });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const joinRoom = (): void => {
        if (!roomId) {
            return;
        }
        navigate(`/rooms/${roomId}`);
    };

    return (
        <div className="flex flex-col gap-3 w-full h-screen items-center justify-center">
            {isLoading && <RaceBy size={150} lineWeight={8} speed={0.5} color="#e07a5f" />}
            {!isLoading && (
                <>
                    <button
                        className="h-12 px-10 rounded-xl bg-orange-500 text-white w-fit mb-4 font-bold hover:bg-orange-600 flex justify-center items-center gap-4"
                        onClick={() => createRoom()}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Create Room
                    </button>
                    or
                    <div className="flex gap-3">
                        <input
                            type="text"
                            className="outline-none bg-white-100 shadow-xl shadow-zinc-200/50 rounded-xl px-4 h-12"
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <button
                            className="h-12 px-10 rounded-xl bg-transparent text-orange-500 w-fit mb-4 font-bold hover:bg-zinc-100 border-orange-500 border-4 disabled:border-none disabled:text-zinc-400"
                            onClick={() => joinRoom()}
                            disabled={roomId.trim() === ''}
                        >
                            Join Room
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
