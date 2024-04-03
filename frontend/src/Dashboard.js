import React, { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { Card, CardContent, Grid, Paper, Stack, Typography, Zoom } from '@mui/material';
import { AppContext } from './App';
import { EventContext } from './event_provider';
import { formatHR, formatUptime, videoForEvent } from './utils';
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

const RandomXCard = ({xmrig}) => (
    <CardContent>
        <Typography variant="h5">RandomX</Typography>
        <Typography variant="h7">{xmrig.user_agent || ''}</Typography>
        <Typography variant="h3">{formatHR(xmrig.hr || 0)}</Typography>
        <Typography variant="h6">Uptime: {formatUptime(xmrig.uptime || 0)}</Typography>
    </CardContent>
);

const Sha3xCard = ({sha3x}) => (
    <CardContent>
        <Typography variant="h5">Sha3x</Typography>
        <Typography variant="h3">{formatHR(sha3x.hr)}</Typography>
        <Typography variant="h6">Threads: {sha3x.threads}</Typography>
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

const VideoCard = () => {
    const videoRef = useRef(null);
    const sourceRef = useRef(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const {events, publish} = useContext(EventContext);
    /*const srcRef = useRef(videoForEvent(null));*/
    const [currentEvent, setCurrentEvent] = useState({});
    
    useEffect(() => {
        for (let event of events) {
            console.log('Handling event', event);
            if (event.status === 'Coinbase Unconfirmed' && event.confirmations === 0) {
                console.log(`Resetting video to ${videoForEvent('block')}`);
                if (sourceRef.current) {
                    sourceRef.current.src = videoForEvent('block');
                }
                if (event !== null) {
                    setShowOverlay(true);
                    setCurrentEvent(event);
                    setTimeout(() => {
                        console.log('Hiding overlay');
                        if (sourceRef.current) {
                            sourceRef.current.src = videoForEvent('default');
                        }
                        setShowOverlay(false);
                        
                    }, 5000); // Hide overlay after 5 seconds
                }
            }
            console.log('Event handler done');
        }
    }, [events]);
    
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
            videoRef.current.play();
        }
    }, [sourceRef.current?.src]);
    
    return (
        <Grid item xs={12} sm={12} md={9} padding={5} sx={{backgroundColor: 'black'}}>
            <video ref={videoRef} width="100%" height="100%" loop autoPlay muted>
                <source ref={sourceRef} src={videoForEvent(null)} type="video/mp4"/>
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
                    <Stack spacing={2}>
                        <Typography variant="h4" color="white">Block found!</Typography>
                        <Typography variant="h3" color="green">{currentEvent.amount} T</Typography>
                        <Typography variant="h6" color="green">Block #{currentEvent.height}</Typography>
                    </Stack>
                
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

const WalletCard = ({wallet}) => (
    <CardContent>
        <Typography variant="h5">Wallet</Typography>
        <PowerSettingsNewIcon sx={{color: wallet.online ? 'green' : 'red'}}/>
        <Typography variant="h6">Pending: {wallet.pending} T</Typography>
        <Typography variant="h6">Confirmed: {wallet.confirmed}</Typography>
        <Typography variant="h6">Blocks found: {wallet.blocks_found}</Typography>
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
                {RoundedCard(<RandomXCard xmrig={state.randomx}/>, state.randomx.mining ? 'green' : 'gray')}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                {RoundedCard(<Sha3xCard sha3x={state.sha3x}/>, state.sha3x.mining ? 'green' : 'gray')}
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
                        {RoundedCard(<WalletCard wallet={state.wallet}/>, '#b0b0ff')}
                    </Grid>
                </Grid>
            </Grid>
            <VideoCard/>
        </Grid>
    );
};

export default Dashboard;
