import React from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';

const VideoCall = ({ appointmentId, userName, onEnd }) => {
    // Unique room name based on appointment ID to ensure privacy
    const roomName = `Sushruta-Consultation-${appointmentId}`;

    return (
        <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-slate-900 text-white">
                <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <h2 className="font-bold text-lg">Live Consultation</h2>
                </div>
                <button 
                    onClick={onEnd}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold transition"
                >
                    Close Window
                </button>
            </div>

            {/* Jitsi Frame */}
            <div className="flex-1 w-full h-full">
                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={roomName}
                    configOverwrite={{
                        startWithAudioMuted: true,
                        disableThirdPartyRequests: true,
                        prejoinPageEnabled: false,
                    }}
                    interfaceConfigOverwrite={{
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'closedcaptions', 'desktop', 
                            'fullscreen', 'fodeviceselection', 'hangup', 
                            'profile', 'chat', 'recording', 'livestreaming', 
                            'etherpad', 'sharedvideo', 'settings', 'raisehand', 
                            'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts', 
                            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
                        ],
                    }}
                    userInfo={{
                        displayName: userName
                    }}
                    onApiReady={(externalApi) => {
                        // Attach event listeners here if needed
                    }}
                    getIFrameRef={(iframeRef) => {
                        iframeRef.style.height = '100%';
                    }}
                />
            </div>
        </div>
    );
};

export default VideoCall;