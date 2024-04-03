import React, { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { Card, CardContent, Grid, Paper, Typography, Zoom } from '@mui/material';
import { AppContext } from './App';
import { formatHR, videoForEvent } from './utils';
import { Gauge } from '@mui/x-charts/Gauge';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const RoundedCard = (item, color) => (
    <Card sx={{borderRadius: '16px', flex: 1, backgroundColor: color, height: '100%'}}>
        {item}
    </Card>
);

const BlockHeightCard = ({height}) => (
    <CardContent>
        <Typography variant="h5">Block Height</Typography>
        <Typography variant="h3">{height}</Typography>
    </CardContent>

);

const RandomXCard = ({hr}) => (
    <CardContent>
        <Typography variant="h5">RandomX</Typography>
        <Typography variant="h3">{formatHR(hr)}</Typography>
    </CardContent>
);

const Sha3xCard = ({hr}) => (
    <CardContent>
        <Typography variant="h5">Sha3x</Typography>
        <Typography variant="h3">{formatHR(hr)}</Typography>
    </CardContent>
);

const CpuCard = ({value}) => (
    <CardContent>
        <Typography variant="h5">CPU</Typography>
        {/* Replace this with your Gauge component */}
        <Gauge width={100} height={100} value={value} startAngle={-90} endAngle={90}
               text={({value, vm}) => `${value}%`}/>
    </CardContent>
);

const VideoCard = ({event}) => {
    const videoRef = useRef(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [src, setSrc] = useState(videoForEvent(null));
    /*const srcRef = useRef(videoForEvent(null));*/
    
    useEffect(() => {
        let vid_src = videoForEvent(event);
        if (vid_src !== src) {
            setSrc(vid_src);
            /*srcRef.current = vid_src;*/
            console.log('New event: ', event);
            if (videoRef.current) {
                videoRef.current.load();
                videoRef.current.play();
            }
            if (event !== null) {
                setShowOverlay(true);
                setTimeout(() => setShowOverlay(false), 5000); // Hide overlay after 5 seconds
            }
        }
    }, [event]);
    return (
        <Grid item xs={12} sm={12} md={9} padding={5} sx={{backgroundColor: 'black'}}>
            <video ref={videoRef} width="100%" height="100%" loop autoPlay muted>
                <source src={src} type="video/mp4"/>
            </video>
            <Zoom in={showOverlay}>
                <Paper elevation={6} sx={{
                    position: 'absolute',
                    top: 200,
                    left: '35%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // 40% transparency
                    width: '600px',
                    height: '400px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Typography variant="h4" color="white">Block found!</Typography>
                </Paper>
            </Zoom>
        </Grid>
    );
};

const StatusCard = ({title, online}) => (
    <CardContent>
        <Typography variant="h5">{title}</Typography>
        <PowerSettingsNewIcon sx={{color: online ? 'green' : 'red'}}/>
    </CardContent>
);

const WalletCard = ({online, pending, balance}) => (
    <CardContent>
        <Typography variant="h5">Wallet</Typography>
        <PowerSettingsNewIcon sx={{color: online ? 'green' : 'red'}}/>
        <Typography variant="h6">Pending: {pending}</Typography>
        <Typography variant="h6">Balance: {balance}</Typography>
    </CardContent>
);
const Dashboard = () => {
    const {state} = useContext(AppContext);
    
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
                {RoundedCard(<BlockHeightCard height={state.node.height}/>, '#b0b0ff')}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                {RoundedCard(<RandomXCard hr={state.randomx.hr}/>, state.randomx.mining ? 'green' : 'gray')}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                {RoundedCard(<Sha3xCard hr={state.sha3x.hr}/>, state.sha3x.mining ? 'green' : 'gray')}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                {RoundedCard(<CpuCard value={state.system.cpu}/>, '#b0b0ff')}
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12}>
                        {RoundedCard(<StatusCard title="Tor" online={state.tor.online}/>, '#b0b0ff')}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        {RoundedCard(<StatusCard title="Node" online={state.node.online}/>, '#b0b0ff')}
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        {RoundedCard(<WalletCard online={state.wallet.online} pending={state.wallet.incomingPending}
                                                 balance={state.wallet.confirmed}/>, '#b0b0ff')}
                    </Grid>
                </Grid>
            </Grid>
            <VideoCard event={state.currentEvent}/>
        </Grid>
    );
};

export default Dashboard;
