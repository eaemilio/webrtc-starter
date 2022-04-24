import { doc, setDoc, onSnapshot, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useFirestore } from 'reactfire';
import { SERVERS } from '../webrtc.types';
import { HangUpButton } from '../components/HangUpButton';
import { MicButton } from '../components/MicButton';
import { VideoButton } from '../components/VideoButton';
import { Link, useLocation, useParams } from 'react-router-dom';
import { DEFAULT_ROOM } from '../constants';

function Room(): JSX.Element {
    const peerConnection = new RTCPeerConnection(SERVERS);
    const localVideo = useRef<HTMLVideoElement>(null);
    const remoteVideo = useRef<HTMLVideoElement>(null);
    const params = useParams();
    const { state } = useLocation();

    const [remoteJoined, setRemoteJoined] = useState(false);

    // Room's firebase reference
    const firestore = useFirestore();
    const roomDoc = doc(firestore, 'rooms', params.roomId ?? DEFAULT_ROOM);
    const offerCandidatesDoc = doc(firestore, 'offerCandidates', params.roomId ?? DEFAULT_ROOM);
    const answerCandidatesDoc = doc(firestore, 'answerCandidates', params.roomId ?? DEFAULT_ROOM);

    useEffect(() => {
        const isCaller = (state as { isHost: boolean })?.isHost;
        isCaller ? createRoom() : joinRoom();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const createRoom = async (): Promise<void> => {
        handleOfferCandidates(true);
        handleSnapshots();
        await setTracks();
        await createOffer();
    };

    const joinRoom = async (): Promise<void> => {
        handleOfferCandidates();
        await setTracks();
        await createAnswer();
    };

    /**
     * Gets local media and remote media.
     */
    const setTracks = async (): Promise<void> => {
        // TODO: Get local media
        // TODO: Handle peer connection ontrack
    };

    /**
     * onicecandidate event is triggered after setting the local description.
     * Saves the candidates into the offer/answer candidates doc.
     * @param isHost if the current user created the room
     */
    const handleOfferCandidates = (isHost = false): void => {
        // TODO: handle onicecandidate
    };

    /**
     * Push tracks from local media stream to the peer connection.
     *
     * @param stream the local media stream
     */
    const addLocalTracks = (stream: MediaStream): void => {
        // TODO: Add local tracks to peer connection
    };

    /**
     * Creates and offer and saves the new offer to the current room doc on Firestore.
     */
    const createOffer = async (): Promise<void> => {
        // TODO: Create offer and save it on the room doc
    };

    /**
     * Handle remote answer and answer candidates from firestore docs.
     */
    const handleSnapshots = (): void => {
        // TODO: Listen for remote answer
        // TODO: Handle answer candidates
    };

    /**
     * Creates an answer and sets the remote description for the peer connection
     */
    const createAnswer = async (): Promise<void> => {
        // TODO: Get offer and set remote description
        // TODO: Create answer and save it to the room doc
        // TODO: Listen for offer candidates
    };

    return (
        <div className="flex h-screen w-screen justify-center items-center">
            <div className="flex flex-col w-screen p-10" style={{ maxWidth: '1200px' }}>
                <div className="flex flex-col">
                    <Link
                        to="/"
                        className="cursor-pointer w-14 h-14 justify-center items-center flex rounded-full bg-orange-500 mb-10 text-white shadow-xl shadow-orange-400/50"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Link>
                    <div className="flex-1 rounded-3xl flex justify-center items-center relative overflow-hidden">
                        <p className="mb-10 px-3 py-2 rounded-xl absolute font-bold text-white room-id">
                            ID: {params.roomId}
                        </p>
                        <div className="rounded-3xl flex items-center justify-evenly multimedia-controls py-3">
                            <VideoButton />
                            <HangUpButton />
                            <MicButton />
                        </div>
                        <video ref={localVideo} autoPlay playsInline className="flex-1"></video>
                        <video
                            ref={remoteVideo}
                            autoPlay
                            playsInline
                            className="flex-1"
                            style={{ width: remoteJoined ? 'auto' : '0' }}
                        ></video>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Room;
