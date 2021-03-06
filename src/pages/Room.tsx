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

    const setTracks = async (): Promise<void> => {
        // TODO: Get local media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        addLocalTracks(stream);
        if (localVideo.current) {
            localVideo.current.srcObject = stream;
            localVideo.current.volume = 0;
        }

        // TODO: Handle peer connection ontrack
        peerConnection.ontrack = (event) => {
            setRemoteJoined(true);
            const remoteStream = new MediaStream();
            const track = event.track;

            if (remoteVideo.current) {
                remoteStream.addTrack(track);
                remoteVideo.current.srcObject = remoteStream;
            }
        };
    };

    const handleOfferCandidates = (isHost = false): void => {
        // TODO: handle onicecandidate
        peerConnection.onicecandidate = async (event) => {
            const candidates = event?.candidate?.toJSON();
            if (candidates) {
                await updateDoc(isHost ? offerCandidatesDoc : answerCandidatesDoc, {
                    candidates: arrayUnion(candidates),
                });
            }
        };
    };

    /**
     * Push tracks from local media stream to the peer connection.
     *
     * @param stream the local media stream
     */
    const addLocalTracks = (stream: MediaStream): void => {
        // TODO: Add local tracks to peer connection
        stream.getTracks().forEach((track) => peerConnection.addTrack(track));
    };

    const createOffer = async (): Promise<void> => {
        // TODO: Create offer and save it on the room doc
        const offerDescription = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offerDescription);

        const { sdp, type } = offerDescription;
        const offer = { sdp, type };
        await setDoc(roomDoc, { offer });
    };

    const handleSnapshots = (): void => {
        // TODO: Listen for remote answer
        onSnapshot(roomDoc, (snapshot) => {
            const data = snapshot.data() ?? {};
            const answer = data.answer;
            if (!peerConnection.remoteDescription && answer) {
                peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        // TODO: Handle answer candidates
        onSnapshot(answerCandidatesDoc, (snapshot) => {
            const candidates = snapshot.get('candidates');
            if (!candidates) {
                return;
            }
            candidates.forEach((candidate: RTCIceCandidateInit) => {
                const iceCandidate = new RTCIceCandidate(candidate);
                peerConnection.addIceCandidate(iceCandidate);
            });
        });
    };

    const createAnswer = async (): Promise<void> => {
        // TODO: Get offer and set remote description
        const doc = await getDoc(roomDoc);
        const data = doc.data();

        if (data?.offer) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        }

        // TODO: Create answer and save it to the room doc
        const answerDescription = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answerDescription);

        const { sdp, type } = answerDescription;
        const answer = { sdp, type };
        await updateDoc(roomDoc, { answer });

        // TODO: Listen for offer candidates
        onSnapshot(offerCandidatesDoc, (snapshot) => {
            const candidates = snapshot.get('candidates');
            console.log(candidates);
            if (!candidates) {
                return;
            }
            candidates.forEach((candidate: RTCIceCandidateInit) => {
                const iceCandidate = new RTCIceCandidate(candidate);
                peerConnection.addIceCandidate(iceCandidate);
            });
        });
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
